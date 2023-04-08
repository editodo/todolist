package com.ls.gpis.web;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.service.DeptService;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;


//메인프레임의 공통 API호출용 컨트롤러
@RestController
@RequestMapping("/Frame")
public class FrameController {

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private MenuService menuService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private DeptService deptService;
    
    // 자신의 권한의 메뉴 리스트를 가져온다.
    @LoginCheck
    @RequestMapping("/GetMenuList")
    public Object GetMenuList(HttpServletRequest request, HttpServletResponse response,
            @RequestBody HashMap<String, Object> map) throws Exception {

        log.debug("GetMenuList");
        String UserID = request.getAttribute("UserID").toString();
        return menuService.selectMenuList(0, UserID);
        
    }
    
    //메뉴의 권한 정보를 반환 한다.
    @LoginCheck
    @RequestMapping("/GetAuthMenu")
    public Object GetAuthMenu(HttpServletRequest request, HttpServletResponse response,
            @RequestBody HashMap<String, Object> map) throws Exception {

        log.debug("GetAuthMenu");
        String UserID = request.getAttribute("UserID").toString();
        return menuService.selectAuthList(UserID);                
    }

    //토큰값이 변조 되지 않았는지 체크 한다.
    @LoginCheck
    @RequestMapping("/CheckToken")
    public String CheckToken(HttpServletRequest request, HttpServletResponse response)throws Exception{

        return "OK";
    }

    //사용자 정보를 반환한다.
    @LoginCheck
    @RequestMapping("/GET_USER_INFO")
    public HashMap<String,Object> GET_USER_INFO(HttpServletRequest request, HttpServletResponse response)throws Exception{

        String UserID = request.getAttribute("UserID").toString();
        return userService.selectUserInfo(UserID);        
    }

    //새로운 토큰 생성(토큰만료 시기를 연장할때 하용)
    @LoginCheck
    @RequestMapping("/TokenUpdate")
    public Object TokenUpdate(HttpServletRequest request)throws Exception
    {
        String UserID = request.getAttribute("UserID").toString();

        HashMap<String,Object> map = new HashMap<String,Object>();

        map.put("JWTToken", jwtService.makeJwt(UserID));      //JWT토큰을 생성한다.
        map.put("JWTTimeoutSec", jwtService.GetJWTTimeoutSec());      //세션 타임아웃 시간 넘긴다
        
        return map;
    }

     //사용자 리스트 정보를 가져온다.
     @RequestMapping("/selectUserBaseInfoList")
     public List<HashMap<String,Object>> selectUserBaseInfoList() throws Exception
     {
         return userService.selectUserBaseInfoList();    
     }
     

    //부서리스트를 가져온다.
    @LoginCheck
    @RequestMapping("/selectDeptList")
    public List<HashMap<String,Object>> selectDeptList()throws Exception
    {
    
        return deptService.selectDeptList();
    }
    
}


