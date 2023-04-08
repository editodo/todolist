package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;


@AuthCheck(MENU_ID=18, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/usermanage")
public class UserManageController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private UserService userService;

    @Autowired
    private LogService logService;

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectUserList")
    public List<HashMap<String,Object>> selectUserList(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return userService.selectUserListCond(searchCond);
    }

    //사용자 ID 중복체크
    @RequestMapping("/checkUserID")
    public CommonDTO checkUserID(@RequestBody HashMap<String, Object> UserInfo)throws Exception{    

        String UserId = UserInfo.get("EMP_USER_ID").toString();
        if(userService.checkUserInfo(UserId))
        {
            //사용자가 이미 존재하는 경우
            return new CommonDTO(false,"아이디 중복 입니다.");
        }            
        return new CommonDTO(true,"사용할 수 있는 아이디 입니다.");
    }

    //신규 로컬 사용자를 등록한다.
    @RequestMapping("/insertUser")
    public CommonDTO insertUser(HttpServletRequest request, @RequestBody HashMap<String, Object> UserInfo)throws Exception{    
        try{
            
            String UserID = request.getAttribute("UserID").toString();
            UserInfo.put("CREATER_ID", UserID);
            
            if(userService.insertLocalUser(UserInfo) == 1)
            {
                return new CommonDTO(true, "정상적으로 등록 되었습니다.");    
            }
        } catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
        return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
    }

    @RequestMapping("/updateUser")
    public CommonDTO updateUser(HttpServletRequest request, @RequestBody HashMap<String, Object> UserInfo)throws Exception{    

        try{
            String UserID = request.getAttribute("UserID").toString();
            UserInfo.put("UPDATE_ID", UserID);            

            if(userService.updateUser(UserInfo) == 1)
            {
                return new CommonDTO(true, "정상적으로 수정 되었습니다.");    
            }
            return new CommonDTO(false, "문제가 발생 하였습니다.");    
        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }

    //패스워드를 강제적으로 리셋한다(관리자 전용)
    @AuthCheck(MENU_ID=18, LEVEL = AuthLevel.WRITE)
    @RequestMapping("/UpdatePassword")
    public CommonDTO UpdatePassword(HttpServletRequest request, @RequestBody HashMap<String, Object> UserInfo)throws Exception{    
    
        //파라메터 값을 가져온다.

        try{
            String UserID = UserInfo.get("EMP_USER_ID").toString();                 
            String ChangePassword = UserInfo.get("PASSWORD").toString();
            return userService.ChangePassword(UserID, ChangePassword);        
        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }        

    }



}