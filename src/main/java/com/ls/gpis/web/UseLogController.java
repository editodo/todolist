package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;

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

@AuthCheck(MENU_ID=15, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/uselog")
public class UseLogController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private LogService logService;





    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectUseLog")
    public List<HashMap<String,Object>> selectUseLog(@RequestBody HashMap<String, Object> searchCond)throws Exception{        
        return logService.selectLogInfo(searchCond);
    }

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectUseLoginLog")
    public List<HashMap<String,Object>> selectUseLoginLog(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        
        return logService.selectUseLoginLog(searchCond);
    }

  

}