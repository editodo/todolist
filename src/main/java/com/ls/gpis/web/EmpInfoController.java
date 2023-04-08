package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.EmpInfoService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@LoginCheck
@RestController
@RequestMapping("/EmpInfo")
public class EmpInfoController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private EmpInfoService EmpInfoService;

    //전체 리스트를 반환한다.
    @RequestMapping("/selectEmpInfo")
    public List<HashMap<String,Object>> selectEmpInfo(@RequestBody HashMap<String, Object> searchCond)throws Exception{        
        return EmpInfoService.selectEmpInfo(searchCond);
    }


  

}