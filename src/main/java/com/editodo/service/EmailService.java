package com.editodo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.mail.host")
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[EdiTodo] 이메일 인증 코드");
        message.setText("안녕하세요! EdiTodo입니다.\n\n" +
                "이메일 인증 코드는 다음과 같습니다:\n\n" +
                "인증 코드: " + verificationCode + "\n\n" +
                "이 코드는 10분 후에 만료됩니다.\n" +
                "본인이 요청하지 않은 경우 이 메일을 무시하세요.");
        
        mailSender.send(message);
        log.info("Verification email sent to: {}", to);
    }
    
    public void sendInquiryResponseEmail(String to, String inquiryTitle, String response) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[EdiTodo] 문의사항 답변");
        message.setText("안녕하세요! EdiTodo입니다.\n\n" +
                "문의하신 내용에 대한 답변입니다.\n\n" +
                "문의 제목: " + inquiryTitle + "\n\n" +
                "답변 내용:\n" + response + "\n\n" +
                "추가 문의사항이 있으시면 언제든 연락주세요.");
        
        mailSender.send(message);
        log.info("Inquiry response email sent to: {}", to);
    }
    
    public void sendPasswordResetEmail(String to, String temporaryPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[EdiTodo] 임시 비밀번호 발급");
        message.setText("안녕하세요! EdiTodo입니다.\n\n" +
                "요청하신 임시 비밀번호입니다:\n\n" +
                "임시 비밀번호: " + temporaryPassword + "\n\n" +
                "보안을 위해 로그인 후 반드시 비밀번호를 변경해주세요.\n" +
                "본인이 요청하지 않은 경우 즉시 비밀번호를 변경하세요.");
        
        mailSender.send(message);
        log.info("Password reset email sent to: {}", to);
    }
}
