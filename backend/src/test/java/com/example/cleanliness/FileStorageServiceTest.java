package com.example.cleanliness;

import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.storage.FileStorageService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FileStorageServiceTest {

    @Autowired
    private FileStorageService fileStorageService;

    @Test
    @DisplayName("1. Store Valid JPEG Image Success")
    void testStoreValidImageSuccess() {
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "toilet_kotor.jpg",
                "image/jpeg",
                "fake image content bytes".getBytes()
        );

        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(file);

        assertNotNull(fileInfo);
        assertEquals("toilet_kotor.jpg", fileInfo.getFileName());
        assertEquals("image/jpeg", fileInfo.getFileType());
        assertTrue(fileInfo.getFilePath().startsWith("/uploads/"));
        assertTrue(fileInfo.getFilePath().endsWith(".jpg"));
    }

    @Test
    @DisplayName("2. Store Invalid Extension (e.g. .exe / .pdf) Throws BadRequestException")
    void testStoreInvalidExtension() {
        MockMultipartFile invalidPdf = new MockMultipartFile(
                "image",
                "document.pdf",
                "application/pdf",
                "pdf content".getBytes()
        );

        assertThrows(BadRequestException.class, () -> fileStorageService.storeFile(invalidPdf));
    }

    @Test
    @DisplayName("3. Store File Exceeding 5 MB Throws BadRequestException")
    void testStoreFileExceedingSize() {
        byte[] oversizedBytes = new byte[6 * 1024 * 1024]; // 6 MB
        MockMultipartFile largeFile = new MockMultipartFile(
                "image",
                "huge_photo.png",
                "image/png",
                oversizedBytes
        );

        assertThrows(BadRequestException.class, () -> fileStorageService.storeFile(largeFile));
    }
}
