package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.DetailCodeDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.CodeDTO;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.CodeService;

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
@RequestMapping("/code")
public class CodeController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private CodeService codeService;

    @Autowired
    private ObjectMapper mapper;

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectCodeList")
    public List<CodeDTO> selectCodeList(HttpServletRequest request, HttpServletResponse response
                ,@RequestParam(value="GROUP_CODE", required=false) String groupCode)throws Exception{    
        //String AUTH_LEVEL = request.getAttribute("AUTH_LEVEL").toString();
        return codeService.selectCodeList(groupCode);
    }

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectDetailCodeList")
    public List<CodeDTO> selectDetailCodeList(HttpServletRequest request, HttpServletResponse response
                    ,@RequestBody DetailCodeDTO code )throws Exception{  
        //String AUTH_LEVEL = request.getAttribute("AUTH_LEVEL").toString();
        return codeService.selectDetailCodeList(code);
    }

    //신규 결재정보를 등록한다.
    @RequestMapping("/insertCode")
    public CommonDTO insertCode(HttpServletRequest request,
                                @RequestBody CodeDTO code)throws Exception{

        System.out.println("Code == " + code.toString());
        if(codeService.insertCode(code) == 1) return new CommonDTO(true, "성공!!!");

        return new CommonDTO(false, "실패!!!");
    }

    
    //신규 결재자를 등록한다.
    @RequestMapping("/insertDetailCode")
    public CommonDTO insertDetailCode(HttpServletRequest request,
                                @RequestBody DetailCodeDTO detailCode)throws Exception{

      
        if(codeService.insertDetailCode(detailCode) == 1) return new CommonDTO(true, "성공!!!");

        return new CommonDTO(false, "실패!!!");
    }

    //결재정보를 수정한다.
    @RequestMapping("/updateCode")
    public CommonDTO updateCode(HttpServletRequest request,
                                @RequestBody CodeDTO code)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(codeService.updateCode(code) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 수정한다.
    @RequestMapping("/updateDetailCode")
    public CommonDTO updateDetailCode(HttpServletRequest request,
                                @RequestBody DetailCodeDTO code)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(codeService.updateDetailCode(code) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 수정한다.
    @RequestMapping("/updateDetailCodeList")
    public CommonDTO updateDetailCodeList(HttpServletRequest request,
                                @RequestBody HashMap<String, Object> map)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();
        String groupCode = (String)map.get("groupCode");
                
        ArrayList<DetailCodeDTO>  codeList = mapper.convertValue(map.get("detailCode"), new TypeReference<List<DetailCodeDTO>>() { });        

        if(codeService.updateDetailCodeList(groupCode, codeList) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }


    //결재정보를 삭제한다.
    @RequestMapping("/deleteCode")
    public CommonDTO deleteCode(HttpServletRequest request,
                    @RequestParam("GROUP_CODE") String groupCode)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(codeService.deleteCode(groupCode) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }

    //결재자정보를 삭제한다.
    @RequestMapping("/deleteDetailCode")
    public CommonDTO deleteDetailCode(HttpServletRequest request,
                                @RequestBody DetailCodeDTO code)throws Exception{
        
        //String UserID = request.getAttribute("UserID").toString();

        if(codeService.deleteDetailCode(code) == 1) return new CommonDTO(true, "성공!!!");
        return new CommonDTO(false, "실패!!!");
    }
    

}