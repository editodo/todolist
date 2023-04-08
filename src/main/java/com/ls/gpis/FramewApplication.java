package com.ls.gpis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class FramewApplication {

	public static void main(String[] args) {
		SpringApplication.run(FramewApplication.class, args);
	}

}
