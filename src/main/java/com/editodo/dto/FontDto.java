package com.editodo.dto;

import lombok.*;

import java.util.List;

public class FontDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GoogleFont {
        private String family;
        private String category;
        private List<String> variants;
        private String url;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FontResponse {
        private String fontFamily;
        private String fontUrl;
        private Boolean isCustom;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FontRequest {
        private String fontFamily;
        private String fontUrl;
    }
}
