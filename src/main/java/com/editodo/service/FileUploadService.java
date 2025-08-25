package com.editodo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {
    
    @Value("${file.upload.path:uploads}")
    private String uploadPath;
    
    @Value("${file.upload.max-size:10485760}") // 10MB
    private long maxFileSize;
    
    public String uploadFile(MultipartFile file) throws IOException {
        // 파일 크기 검증
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("파일 크기가 너무 큽니다. 최대 " + (maxFileSize / 1024 / 1024) + "MB까지 업로드 가능합니다.");
        }
        
        // 업로드 디렉토리 생성
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        
        // 고유한 파일명 생성
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String storedFilename = UUID.randomUUID().toString() + extension;
        
        // 파일 저장
        Path filePath = uploadDir.resolve(storedFilename);
        Files.copy(file.getInputStream(), filePath);
        
        log.info("파일 업로드 완료: {} -> {}", originalFilename, storedFilename);
        
        return storedFilename;
    }
    
    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadPath, filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("파일 삭제 완료: {}", filename);
            }
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", filename, e);
        }
    }
    
    public File getFile(String filename) {
        Path filePath = Paths.get(uploadPath, filename);
        return filePath.toFile();
    }
}
