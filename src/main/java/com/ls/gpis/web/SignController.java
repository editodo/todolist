package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.SignDTO;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.SignService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@AuthCheck(MENU_ID=14, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/sign")
public class SignController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private SignService signService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private ObjectMapper mapper;

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectSignList")
    public List<SignDTO> selectSignList(HttpServletRequest request, HttpServletResponse response
                ,@RequestParam(value="EMP_USER_ID", required=false) String empUserId)throws Exception{    
        empUserId = request.getAttribute("UserID").toString();
        return signService.selectSignList(empUserId);
    }

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectSignMemberList")
    public List<HashMap<String, Object>> selectSignMemberList(HttpServletRequest request, HttpServletResponse response
                    ,@RequestBody SignDTO Sign )throws Exception{  
        //String AUTH_LEVEL = request.getAttribute("AUTH_LEVEL").toString();
        int signId = Sign.SIGN_ID;
        return signService.selectSignMemberList(signId);
    }

    //전체 메뉴별 결제 리스트를 반환한다.
    @RequestMapping("/selectMenuSignList")
    public List<MenuDTO> selectMenuSignList(HttpServletRequest request, HttpServletResponse response
                    ,@RequestBody SignDTO Sign )throws Exception{  
        //String AUTH_LEVEL = request.getAttribute("AUTH_LEVEL").toString();
        String empUserId = request.getAttribute("UserID").toString();
        return menuService.selectMenuSignList(0, empUserId);
    }
    
    //신규 결재정보를 등록한다.
    @RequestMapping("/insertSign")
    public CommonDTO insertSign(HttpServletRequest request,
                                @RequestBody SignDTO Sign)throws Exception{

        String UserID = request.getAttribute("UserID").toString();
        Sign.EMP_USER_ID = UserID;
        Sign.CREATER_ID = UserID;

        System.out.println("Sign == " + Sign.toString());
        if(signService.insertSign(Sign) == 1) return new CommonDTO(true, "성공!!!");

        return new CommonDTO(false, "실패!!!");
    }

    
    //신규 결재자를 등록한다.
    @RequestMapping("/insertSignMember")
    public CommonDTO insertSignMember(HttpServletRequest request,
                                @RequestBody SignDTO Sign)throws Exception{

        System.out.println("Sign == " + Sign.toString());
        // if(signService.insertSignMember() == 1) return new CommonDTO(true, "성공!!!");

        return new CommonDTO(false, "실패!!!");
    }

    //결재정보를 수정한다.
    @RequestMapping("/updateSign")
    public CommonDTO updateSign(HttpServletRequest request,
                                @RequestBody SignDTO Sign)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();        
        String UserID = request.getAttribute("UserID").toString();
        Sign.EMP_USER_ID = UserID;
        Sign.CREATER_ID = UserID;

        System.out.println("busanyong"+Sign.SIGN_NAME);

        if(signService.updateSign(Sign) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 수정한다.
    @RequestMapping("/updateSignMember")
    public CommonDTO updateSignMember(HttpServletRequest request,
                                @RequestBody SignDTO Sign)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(signService.updateSignMember(Sign) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 수정한다.
    @RequestMapping("/updateSignMemberList")
    public CommonDTO updateSignMemberList(HttpServletRequest request,
                                @RequestBody HashMap<String, Object> map)throws Exception{

        String CREATER_ID = request.getAttribute("UserID").toString();                
        HashMap<String, Object> signInfo = (HashMap<String, Object>)map.get("SignInfo");
        //ArrayList<HashMap<String, Object>> UserList = mapper.convertValue(map.get("GroupUserList"), new TypeReference<ArrayList<HashMap<String, Object>>>() { });
        List<HashMap<String, Object>> signMemberList = mapper.convertValue(map.get("SignUserList"), new TypeReference<List<HashMap<String, Object>>>() { });
        

        if(signService.updateSignMemberList((int)signInfo.get("SIGN_ID"), CREATER_ID, signMemberList) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

        //메뉴의 결제 정보를 갱신한다.
        @RequestMapping("/updateMenuSignList")
        public List<MenuDTO> updateMenuSignList(HttpServletRequest request,
            @RequestBody HashMap<String, Object> map)throws Exception
        {
            String empUserId = request.getAttribute("UserID").toString();
            ArrayList<MenuDTO> menuList = mapper.convertValue(map.get("MenuSignList"), new TypeReference<List<MenuDTO>>() { });
         
            signService.updateMenuSignList(empUserId, menuList);    
        
            return menuList;
        }

    //결재정보를 삭제한다.
    @RequestMapping("/deleteSign")
    public CommonDTO deleteSign(HttpServletRequest request,
                    @RequestBody SignDTO Sign)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();
        System.out.println("Sign.SIGN_ID"+Sign.SIGN_ID);
        int signId= Sign.SIGN_ID;

        if(signService.deleteSign(signId) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 삭제한다.
    @RequestMapping("/deleteSignMember")
    public CommonDTO deleteSignMember(HttpServletRequest request,
                                @RequestBody SignDTO Sign)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(signService.deleteSignMember(Sign) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }
    

}