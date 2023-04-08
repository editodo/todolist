package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;

import com.ls.gpis.service.LogService;
import com.ls.gpis.service.SystemFlagService;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;



@LoginCheck
@RestController
@RequestMapping("/SystemFlag")
public class SystemFlagController{
    
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private SystemFlagService systemFlagService;

    //전체 시스템 플레그 리스트를 반환한다.
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.READ)
    @RequestMapping("/selectSystemFlagList")
    public List<HashMap<String,Object>> selectSystemFlagList(@RequestBody HashMap<String, Object> searchCond)throws Exception{                
        return systemFlagService.selectSystemFlagList(searchCond);
        
    }

    //시스템 플래그 정보를 가져온다.(상세)
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.READ)
    @RequestMapping("/selectSystemFlag")
    public HashMap<String,Object> selectSystemFlag(@RequestBody HashMap<String, Object> searchCond)throws Exception{                

        return systemFlagService.selectSystemFlag(searchCond);
    }
    
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.READ)
    @RequestMapping("/selectFLAG_NAMEList")
    public List<HashMap<String,Object>> selectFLAG_NAMEList(@RequestBody HashMap<String, Object> searchCond)throws Exception{                

        return systemFlagService.selectFLAG_NAMEList(searchCond);
    }

    

    //시스템 플레그를 등록한다.
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/insertSystemFlag")
    public CommonDTO insertSystemFlag(HttpServletRequest request,
                                    @RequestBody HashMap<String, Object> SystemFlagData)throws Exception
    {
        return systemFlagService.insertSystemFlag(request, SystemFlagData);
    }


    //시스템 플레그를 수정한다.
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/updateSystemFlag")
    public CommonDTO updateSystemFlag(HttpServletRequest request,
                                    @RequestBody HashMap<String, Object> SystemFlagData)throws Exception
    {
        return systemFlagService.updateSystemFlag(request, SystemFlagData);
    }

    //시스템 플래그를 삭제한다.
    @AuthCheck(MENU_ID=19, LEVEL = AuthLevel.DELETE)
    @RequestMapping("/deleteSystemFlag")
    public CommonDTO deleteSystemFlag(HttpServletRequest request,
                                        @RequestBody HashMap<String, Object> SystemFlagData)throws Exception
    {
        return systemFlagService.deleteSystemFlag(request, SystemFlagData);
    }


    //컴포넌트 시스템 플레그 조회용
    @RequestMapping("/GetSystemFlag")
    public List<HashMap<String,Object>> GetSystemFlag(@RequestBody HashMap<String, Object> searchCond)throws Exception{                
        
        return systemFlagService.selectSystemFlagList(searchCond);        
    }




}