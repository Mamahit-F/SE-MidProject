package com.example.cleanliness.storage;

import com.example.cleanliness.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final long maxFileSize;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    public FileStorageService(
            @Value("${app.upload.dir:uploads}") String uploadDir,
            @Value("${app.upload.max-file-size:5242880}") long maxFileSize) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.maxFileSize = maxFileSize;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Tidak dapat membuat direktori penyimpanan file di: " + this.fileStorageLocation, ex);
        }
    }

    public StoredFileInfo storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File foto tidak boleh kosong");
        }

        // Validate File Size
        if (file.getSize() > maxFileSize) {
            throw new BadRequestException(String.format("Ukuran file (%.2f MB) melebihi batas maksimal 5 MB", file.getSize() / (1024.0 * 1024.0)));
        }

        // Validate MIME Type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Tipe konten file tidak diizinkan. Hanya format JPG, JPEG, PNG, atau WEBP yang diperbolehkan.");
        }

        // Validate Extension
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFileName.length() - 1) {
            fileExtension = originalFileName.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new BadRequestException("Ekstensi file '" + fileExtension + "' tidak didukung. Gunakan .jpg, .jpeg, .png, atau .webp");
        }

        // Generate unique safe file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "." + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            String publicUrl = "/uploads/" + uniqueFileName;
            return new StoredFileInfo(originalFileName, publicUrl, contentType, file.getSize());
        } catch (IOException ex) {
            throw new RuntimeException("Gagal menyimpan file " + originalFileName + ". Silakan coba lagi!", ex);
        }
    }

    public StoredFileInfo storeBase64Image(String base64Data) {
        if (base64Data == null || base64Data.trim().isEmpty()) {
            throw new BadRequestException("Data gambar tidak boleh kosong");
        }

        String raw = base64Data.trim();
        String contentType = "image/jpeg";
        String extension = "jpg";
        String base64Payload = raw;

        if (raw.startsWith("data:")) {
            int commaIndex = raw.indexOf(',');
            if (commaIndex != -1) {
                String header = raw.substring(0, commaIndex);
                base64Payload = raw.substring(commaIndex + 1);

                int colonIndex = header.indexOf(':');
                int semiIndex = header.indexOf(';');
                if (colonIndex != -1 && semiIndex != -1 && semiIndex > colonIndex) {
                    contentType = header.substring(colonIndex + 1, semiIndex).trim().toLowerCase();
                    if (contentType.contains("png")) {
                        extension = "png";
                    } else if (contentType.contains("webp")) {
                        extension = "webp";
                    } else if (contentType.contains("gif")) {
                        extension = "gif";
                    } else {
                        extension = "jpg";
                    }
                }
            }
        }

        try {
            byte[] imageBytes = Base64.getDecoder().decode(base64Payload.replaceAll("\\s+", ""));

            if (imageBytes.length > maxFileSize) {
                throw new BadRequestException(String.format("Ukuran file (%.2f MB) melebihi batas maksimal 5 MB", imageBytes.length / (1024.0 * 1024.0)));
            }

            String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "." + extension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.write(targetLocation, imageBytes);

            String publicUrl = "/uploads/" + uniqueFileName;
            return new StoredFileInfo("foto_bukti." + extension, publicUrl, contentType, (long) imageBytes.length);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Format base64 foto tidak valid");
        } catch (IOException ex) {
            throw new RuntimeException("Gagal menyimpan foto: " + ex.getMessage(), ex);
        }
    }

    public static class StoredFileInfo {
        private final String fileName;
        private final String filePath;
        private final String fileType;
        private final long fileSize;

        public StoredFileInfo(String fileName, String filePath, String fileType, long fileSize) {
            this.fileName = fileName;
            this.filePath = filePath;
            this.fileType = fileType;
            this.fileSize = fileSize;
        }

        public String getFileName() {
            return fileName;
        }

        public String getFilePath() {
            return filePath;
        }

        public String getFileType() {
            return fileType;
        }

        public long getFileSize() {
            return fileSize;
        }
    }
}
