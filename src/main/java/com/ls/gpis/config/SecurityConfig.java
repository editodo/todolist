package com.ls.gpis.config;



import java.util.Arrays;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    
    //요기 참고 할것!!!
    //https://postitforhooney.tistory.com/entry/SpringSecurity-%EC%B4%88%EB%B3%B4%EC%9E%90%EA%B0%80-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-Spring-Security-%ED%8D%BC%EC%98%B4?category=670929

    protected Log log = LogFactory.getLog(this.getClass());

    @Override
    public void configure(WebSecurity web) throws Exception{
        log.debug("configure2");        
        
        
        web.ignoring().antMatchers("/css/**", "/images/**", "js/**", "/vendors/**");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception{

        log.debug("configure1");

        http.csrf().disable();
        http.cors();    //개발을 위해서 크로스사이팅을 허용한다.

        
        http.authorizeRequests()
            //.antMatchers("/admin/**").hasRole("ADMIN")           
            .antMatchers("/**").permitAll();        //로그인 관련 주소는 누구든지 접근 가능하도록
            
            //.antMatchers("/**").permitAll();
            
        http.logout().logoutUrl("/login/pmsLogout")
                     .logoutSuccessUrl("/login/login")
                     .invalidateHttpSession(true)
                     .permitAll();

            
    }

    //크로스 사이팅 허용....
    @Bean    
    CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();        


                configuration.setAllowedOrigins(Arrays.asList("*"));        
                configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT"));                        
                configuration.addExposedHeader(HttpHeaders.CONTENT_DISPOSITION);                        //파일다운로드 되도록..하기위함..                
                configuration.setAllowedHeaders(Arrays.asList("*"));        
                configuration.setAllowCredentials(true);        
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();        
                source.registerCorsConfiguration("/**", configuration);        
                
                return source;    
            
    }
    

}