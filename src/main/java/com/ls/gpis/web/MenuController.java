package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
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

@AuthCheck(MENU_ID=14, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/menu")
public class MenuController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private MenuService menuService;





    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectMenuList")
    public List<MenuItemDTO> selectMenuList(HttpServletRequest request, HttpServletResponse response)throws Exception{        
        
        return menuService.selectMenuList(0);
    }

    //신규 메뉴정보를 등록한다.
    @RequestMapping("/insertMenu")
    public CommonDTO insertMenu(HttpServletRequest request,
                                @RequestBody MenuItemDTO menuItem)throws Exception{

        String UserID = request.getAttribute("UserID").toString();
        menuItem.CREATER_ID = UserID;
        if(menuService.insertMenu(menuItem) == 1) return new CommonDTO(true, "성공!!!");

        return new CommonDTO(false, "실패!!!");
    }


    //메뉴정보를 수정한다.
    @RequestMapping("/updateMenu")
    public CommonDTO updateMenu(HttpServletRequest request,
                                @RequestBody MenuItemDTO menuItem)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(menuService.updateMenu(menuItem) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

}