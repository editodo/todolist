package com.ls.gpis.batch;

import org.springframework.stereotype.Component;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.scheduling.annotation.Scheduled;

@Component
public class SampleTask{
    
    protected Log log = LogFactory.getLog(this.getClass());

    // 매분 0초에 실행
    //@Scheduled(cron = "0 * * * * *")
    public void test4(){
        
        log.info("매분 0초에 실행");
    }

    // 매분 5초에 실행
    //Scheduled(cron = "5 * * * * *")
    public void test5(){
        log.info("매분 5초에 실행");
    }

    // 매일 5시 30분 0초에 실행한다.
    @Scheduled(cron = "0 30 5 * * *")
    public void test(){
        //여기에 로직 실행
    }

    // 매월 1일 0시 0분 0초에 실행한다.
    @Scheduled(cron = "0 0 0 1 * *")    
    public void test1(){
        //여기에 로직 실행        
    }

    // 애플리케이션 시작 후 6초 후에 첫 실행, 그 후 매 6초마다 주기적으로 실행한다.
    //@Scheduled(initialDelay = 6000, fixedDelay = 6000)
    public void test2(){
        log.info("실행후 6초 마다 실행");
    }


}