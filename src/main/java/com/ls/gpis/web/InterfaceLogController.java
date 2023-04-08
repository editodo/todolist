package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.service.InterfaceService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;




@RestController
@AuthCheck(MENU_ID=102, LEVEL = AuthLevel.READ)
@RequestMapping("/Interface_log")
public class InterfaceLogController{
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private InterfaceService interfaceService;

    //구매이력 I/F 정보를 반환한다.    
    @RequestMapping("/selectBuyList")
    public List<HashMap<String,Object>> selectBuyList(@RequestBody HashMap<String, Object> searchCond)throws Exception{                
        return interfaceService.selectBuyList(searchCond);
        
    }

    //업체정보 I/F를 반환한다.
    @RequestMapping("/selectCompanyList")
    public List<HashMap<String,Object>> selectCompanyList(@RequestBody HashMap<String, Object> searchCond)throws Exception{                
        return interfaceService.selectCompanyList(searchCond);
        
    }

    //업체평가정보 I/F를 반환한다.
    @RequestMapping("/selectCompanyEstimationList")
    public List<HashMap<String,Object>> selectCompanyEstimationList(@RequestBody HashMap<String, Object> searchCond)throws Exception{                
        return interfaceService.selectCompanyEstimationList(searchCond);
    }

}