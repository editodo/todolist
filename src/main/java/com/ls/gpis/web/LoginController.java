package com.ls.gpis.web;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//import javax.xml.crypto.Data;

import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.UserService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//로그인용 컨트롤러

@RestController
@RequestMapping("/Login")
public class LoginController {

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private LogService logService;      //사용 로그 정보를 저장하기 위한 서비스   
    

    //로그인 로직을 넣는다.
    @RequestMapping("/SignIn")
    public Object SignIn(HttpServletRequest request, 
                            HttpServletResponse response,
                            @RequestBody HashMap<String,Object> map)throws Exception
    {        
        CommonDTO dto = new CommonDTO();    //결과를 반환할 객체를 생성한다.

        String UserID = map.get("userID").toString();           //입력한 사용자 ID를 가져온다.
        String Password = map.get("Password").toString();       //패스워드를 가져온다.

        //로그출력
        log.info(UserID);             //사용자 ID               
        log.info(Password);           //Password                
        

        //활성화된 사용자인지 체크
        HashMap<String,Object> UserInfo = userService.selectUserInfo(UserID);
        if(UserInfo == null)
        {

            dto.setMsg("사용자 정보를 찾을수 없습니다.");
            dto.setRet(false);
            return dto;
        }

        String actv = UserInfo.get("ACTV").toString();
        if(!actv.equals("Y"))
        {
            dto.setMsg("비활성화된 사용자입니다.");
            dto.setRet(false);
            return dto;
        }

        //패스워드 검증
        if(userService.CheckPassword(UserID, Password) == true){
            //패스워드 검증 완료

            map.put("JWTToken", jwtService.makeJwt(UserID));      //JWT토큰을 생성한다.
            map.put("JWTTimeoutSec", jwtService.GetJWTTimeoutSec());      //세션 타임아웃 시간 넘긴다

            dto.setMsg("성공!!!!");
            dto.setRet(true);
            dto.setData(map);

            //사용정보를 저장한다.
            logService.insertUseLoginLog(UserID, request.getRemoteAddr());

            return dto;     //결과를 반환한다.
        }        


        dto.setMsg("패스워드 불일치");
        dto.setRet(false);

        return dto;     //결과를 반환한다.
    }



    //패스워드 변경 처리를 한다.
    @LoginCheck
    @RequestMapping("/PasswordChangeUser")
    public CommonDTO PasswordChangeUser(HttpServletRequest request, 
                                        HttpServletResponse response,
                                        @RequestBody HashMap<String, Object> UserInfo)throws Exception{    

        
        //토큰에서 사용자 정보를 가져온다.
        String UserID = request.getAttribute("UserID").toString();

        //파라메터 값을 가져온다.
        String OrgPassword = UserInfo.get("OrgPassword").toString();                 
        String ChangePassword = UserInfo.get("ChgPassword1").toString();
        String ChangePasswordConfirm = UserInfo.get("ChgPassword2").toString();

        return userService.PasswordChangeUser(UserID, 
                                              OrgPassword, 
                                              ChangePassword, 
                                              ChangePasswordConfirm);    
    }

}