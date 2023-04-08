package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.StatisticsService;

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

@AuthCheck(MENU_ID=404, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/BuyStatisticsClass")
public class BuyStatisticsClassController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private StatisticsService statisticsService;

     //국가별 구매 이력을 가져온다.
     @RequestMapping("/selectBuyList_Class")
     public List<HashMap<String,Object>> selectBuyList_Class(@RequestBody HashMap<String, Object> searchCond)throws Exception{        
         return statisticsService.selectBuyList_Class(searchCond);
     }

}