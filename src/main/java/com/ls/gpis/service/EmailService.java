package com.ls.gpis.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Properties;

import javax.activation.FileDataSource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("${mail.from}")
    private String MAIL_FROM; // 메일 송신 주소는 프로퍼티에서 받아온다.

    @Value("${mailfile.upload.directory}")
    private String FILE_FOLDER;

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = createMessage(to, subject, text);
        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    // 전송 메일 내용을 HTML형식으로 보낼때 사용
    public void sendSimpleMessageHtml(String to, String subject, String text) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom(MAIL_FROM);
        helper.setTo(to);
        helper.setSubject(subject);// 제목
        helper.setText(text, true);// 내용
        helper.setSentDate(new Date());

        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    public void sendFileMessage(String to, String subject, String text, String fileName) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setSubject(subject);// 제목
        helper.setText(text);// 내용
        helper.setSentDate(new Date());
        FileSystemResource file = new FileSystemResource(new File(fileName));
        helper.addAttachment(fileName, file);

        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    private SimpleMailMessage createMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);// 제목
        message.setText(text);// 내용
        message.setSentDate(new Date());
        return message;
    }

    // 전송 메일 내용을 HTML형식으로 보낼때 사용
    public void sendBoardMessage(String send, String to, String subject, String text) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom(send);
        helper.setTo(to);
        helper.setSubject(subject);// 제목
        helper.setText(text, true);// 내용
        helper.setSentDate(new Date());

        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    // 전송 메일 내용을 HTML형식으로 보낼때 사용
    public void sendBoardFileMessage(String send, String to, String subject, String text, MultipartFile[] files)
            throws MessagingException {
        // String mail_EncodingType = "";

        // Properties props = new Properties();
        // props.put("mail.smtp.host", );

        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "EUC_KR");
        helper.setFrom(send);
        helper.setTo(to);
        helper.setSubject(subject);// 제목
        helper.setText(text, true);// 내용
        helper.setSentDate(new Date());

        for (int i = 0; i < files.length; i++) {
            try {
                byte[] bytes = files[i].getBytes();
                String filename = files[i].getOriginalFilename();
                Path path = Paths.get(FILE_FOLDER + filename);        
                Files.write(path, bytes); // HDD에 파일 저장
                File file = new File(FILE_FOLDER + filename);
                
                FileSystemResource fds = new FileSystemResource(path);

                helper.addAttachment(MimeUtility.encodeText(filename, "EUC_KR", "B"), fds);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }        
        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
        
    }



}


