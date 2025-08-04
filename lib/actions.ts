"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { writeFile, readFile, unlink, mkdir, access } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const s3Client = new S3Client({
  region: "auto", // R2 uses 'auto' as the region
  endpoint: process.env.R2_ENDPOINT, // Your R2 endpoint
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

export async function removeVideoFromR2(fileName: string): Promise<void> {
  try {
    const deleteParams = {
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log(`Successfully deleted ${fileName} from R2`);
  } catch (error) {
    console.error("Error deleting file from R2:", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
}

export async function uploadFile(
  file: File,
  fileName: string
): Promise<string> {
  try {
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "";
    const uniqueFileName = `${fileName}_${timestamp}.${extension}`;

    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine content type
    let contentType = file.type;
    if (!contentType) {
      // Fallback content type detection based on extension
      const ext = extension.toLowerCase();
      if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
        contentType = `video/${ext === "mov" ? "quicktime" : ext}`;
      } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;
      } else {
        contentType = "application/octet-stream";
      }
    }

    // Upload to R2
    const uploadParams = {
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Return the internal path
    return uniqueFileName;
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
}

export async function getFileFromR2(
  fileName: string
): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    const getParams = {
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    };

    const response = await s3Client.send(new GetObjectCommand(getParams));

    if (!response.Body) {
      throw new Error("No file data received from R2");
    }

    // Convert the AWS SDK stream to buffer
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = response.Body as NodeJS.ReadableStream;

      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const contentType = response.ContentType || "application/octet-stream";

    return { buffer, contentType };
  } catch (error) {
    console.error("Error fetching file from R2:", error);
    throw new Error(`Failed to fetch file: ${error}`);
  }
}

export interface CompressionOptions {
  quality: "high" | "medium" | "low" | "web";
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
}

export async function compressVideo(
  videoFile: File,
  options: CompressionOptions = { quality: "medium" }
): Promise<File> {
  //if video is less than 5mb, return the original video
  if (videoFile.size < 5 * 1024 * 1024) {
    console.log("Video is less than 5mb, compressing skipped");
    return videoFile;
  }

  // Create temp directory if it doesn't exist
  const tempDir = join(process.cwd(), "temp");
  if (!existsSync(tempDir)) {
    await mkdir(tempDir, { recursive: true });
  }

  // Generate unique filenames
  const timestamp = Date.now();
  const videoExtension = videoFile.name.split(".").pop() || "mp4";
  const tempInputPath = join(
    tempDir,
    `temp_input_${timestamp}.${videoExtension}`
  );
  const tempOutputPath = join(tempDir, `temp_compressed_${timestamp}.mp4`);

  try {
    // Convert File to buffer and save temporarily
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    await writeFile(tempInputPath, videoBuffer);

    console.log(`Starting video compression (${options.quality} quality)...`);

    // Get compression settings based on quality preset
    const compressionSettings = getCompressionSettings(options);

    // Compress video using ffmpeg
    await new Promise<void>(async (resolve, reject) => {
      // Dynamic import to avoid webpack warnings
      const ffmpeg = (await import("fluent-ffmpeg")).default;
      
      let command = ffmpeg(tempInputPath);

      // Video codec and quality settings
      command = command
        .videoCodec("libx264")
        .audioCodec("aac")
        .audioBitrate("128k")
        .outputOptions(compressionSettings.videoOptions);

      command
        .output(tempOutputPath)
        .on("error", (err: any) => {
          console.error("Video compression error:", err);
          reject(new Error(`Failed to compress video: ${err.message}`));
        })
        .on("end", () => {
          console.log("Video compression completed successfully");
          resolve();
        })
        .on("progress", (progress: any) => {
          console.log(
            `Compression progress: ${Math.round(progress.percent || 0)}%`
          );
        })
        .on("start", (commandLine: string) => {
          console.log("FFmpeg compression command:", commandLine);
        });

      try {
        command.run();
      } catch (runError) {
        console.error("Failed to start compression:", runError);
        reject(new Error(`Failed to start compression: ${runError}`));
      }
    });

    // Verify compressed video was created
    if (!(await fileExists(tempOutputPath))) {
      throw new Error("Compressed video file was not created");
    }

    console.log("Reading compressed video file...");

    // Read the compressed video and create a new File object
    const compressedBuffer = await readFile(tempOutputPath);
    const originalSize = videoFile.size;
    const compressedSize = compressedBuffer.length;
    const compressionRatio = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(
      `Compression complete: ${formatBytes(originalSize)} → ${formatBytes(
        compressedSize
      )} (${compressionRatio}% reduction)`
    );

    const compressedBlob = new Blob([new Uint8Array(compressedBuffer)], { type: "video/mp4" });
    const compressedFile = new File(
      [compressedBlob],
      `compressed_${videoFile.name.split(".")[0]}.mp4`,
      {
        type: "video/mp4",
      }
    );

    return compressedFile;
  } finally {
    // Clean up temporary files
    try {
      if (await fileExists(tempInputPath)) {
        await unlink(tempInputPath);
        console.log("Cleaned up temp input file");
      }
      if (await fileExists(tempOutputPath)) {
        await unlink(tempOutputPath);
        console.log("Cleaned up temp compressed file");
      }
    } catch (error) {
      console.warn("Failed to clean up compression temp files:", error);
    }
  }
}

function getCompressionSettings(options: CompressionOptions) {
  switch (options.quality) {
    case "high":
      return {
        videoOptions: [
          "-crf",
          "18", // High quality (lower = better quality)
          "-preset",
          "slow", // Better compression
          "-profile:v",
          "high",
          "-level",
          "4.0",
          "-pix_fmt",
          "yuv420p",
        ],
      };

    case "medium":
      return {
        videoOptions: [
          "-crf",
          "23", // Medium quality (default)
          "-preset",
          "medium",
          "-profile:v",
          "high",
          "-level",
          "4.0",
          "-pix_fmt",
          "yuv420p",
        ],
      };

    case "low":
      return {
        videoOptions: [
          "-crf",
          "28", // Lower quality
          "-preset",
          "fast",
          "-profile:v",
          "main",
          "-level",
          "3.1",
          "-pix_fmt",
          "yuv420p",
        ],
      };

    case "web":
      return {
        videoOptions: [
          "-crf",
          "25", // Web-optimized
          "-preset",
          "medium",
          "-profile:v",
          "baseline", // Better browser compatibility
          "-level",
          "3.0",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart", // Enable progressive download
        ],
      };

    default:
      return getCompressionSettings({ quality: "medium" });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Updated uploadVideo function with compression option
export async function uploadVideo(videoFile: File, videoName: string) {
  let processedVideo = videoFile;

  processedVideo = await compressVideo(videoFile);
  const videoPath = await uploadFile(processedVideo, videoName);

  return videoPath;
}
