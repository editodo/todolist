package com.editodo.controller;

import com.editodo.dto.NoticeDto;
import com.editodo.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {
    
    private final FileUploadService fileUploadService;
    
    // 파일 업로드
    @PostMapping("/upload")
    public ResponseEntity<NoticeDto.AttachmentRequest> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String storedFilename = fileUploadService.uploadFile(file);
            
            NoticeDto.AttachmentRequest attachment = NoticeDto.AttachmentRequest.builder()
                    .originalFilename(file.getOriginalFilename())
                    .storedFilename(storedFilename)
                    .filePath("/api/files/download/" + storedFilename)
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .build();
            
            return ResponseEntity.ok(attachment);
        } catch (IOException e) {
            log.error("파일 업로드 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 파일 다운로드
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("파일 다운로드 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 파일 삭제
    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename) {
        fileUploadService.deleteFile(filename);
        return ResponseEntity.ok().build();
    }
}
