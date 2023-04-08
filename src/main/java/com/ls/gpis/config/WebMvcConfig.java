package com.ls.gpis.config;

//import com.kwgisado.woo.framework.security.AuthCheckInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

	// @Autowired	
    // private TockenInterceptor interceptor;
    
    @Autowired	
    private AuthCheckInterceptor authCheckInterceptor;

    @Autowired	
    private LoginCheckInterceptor loginCheckInterceptor;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
        
        //토큰 로그인 체크 인터셉터를 등록해준다.
        registry.addInterceptor(loginCheckInterceptor)                
                .addPathPatterns("/**")
                .excludePathPatterns("/css/**")
                .excludePathPatterns("/images/**")
                .excludePathPatterns("/js/**")
                .excludePathPatterns("/vendors/**");
                //.excludePathPatterns("/Login/**");
                
        //권한관련 인터셉터 추가
        registry.addInterceptor(authCheckInterceptor).addPathPatterns("/**")
                .excludePathPatterns("/css/**")
                .excludePathPatterns("/images/**")
                .excludePathPatterns("/js/**")
                .excludePathPatterns("/vendors/**");		
	}

	//cors허용
	@Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            
            public void addCorsMappings(CorsRegistry registry) {
				//registry.addMapping("/**").allowedOrigins("*");
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080")
                        .exposedHeaders("Content-Disposition");
				
            }
        };
	}
	
}
