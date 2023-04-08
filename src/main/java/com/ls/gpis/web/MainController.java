package com.ls.gpis.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


//index호출용 컨트롤러
@Controller
public class MainController {
    protected Log log = LogFactory.getLog(this.getClass());

    //Tomcat에서는 모든 웹호출을 index로 포워딩 한다.
    //@RequestMapping(value={"", "/", "/error", "/*"}, method = RequestMethod.GET)
    @RequestMapping(value={"", "/", "/error", "/*"}, method = RequestMethod.GET)
    public String index() {
        return "index";
    }
    
}
