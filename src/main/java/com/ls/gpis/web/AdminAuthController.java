package com.ls.gpis.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@AuthCheck(MENU_ID=12, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/adminauth")
public class AdminAuthController {
    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private UserService userUservice;

    @Autowired
    private MenuService menuUservice;

    @Autowired
    private ObjectMapper mapper;

    //사용자 리스트를 반환한다.
    @RequestMapping("/selectUserList")
    public Object GetUserList(HttpServletRequest request, 
                            HttpServletResponse response)throws Exception
    {        

        return userUservice.selectUserList();
    }

    //현재 사용자의 권한 정보를 반환한다.
    @RequestMapping("/selectUserAuthList")
    public Object selectUserAuthList(HttpServletRequest request, 
                            HttpServletResponse response,
                            @RequestBody HashMap<String, Object> map)throws Exception                            
    {        
        String userId = map.get("EMP_USER_ID").toString();
        
        return menuUservice.selectAuthMenuList(0, userId);
    }

    //수정한 사용자 정보를 DB서버에 반영한다.
    @RequestMapping("/updateUserAuthList")
    public List<MenuDTO> updateUserAuthList(HttpServletRequest request, 
                                    HttpServletResponse response,
                                    @RequestBody HashMap<String, Object> map                                    
                                    )throws Exception 
    {
        
        String UserID = map.get("selUserID").toString();
        //ObjectMapper mapper = new ObjectMapper();
        ArrayList<MenuDTO> menuList3 = mapper.convertValue(map.get("MenuList"), new TypeReference<List<MenuDTO>>() { });
        
        menuUservice.updateUserAuthList(menuList3, UserID);  //메뉴정보를 업데이트 한다.
        return menuList3;
    }
    


}


