package com.ls.gpis.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.service.AdminService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@AuthCheck(MENU_ID=13, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/authgroup")
public class AuthGroupController {
    protected Log log = LogFactory.getLog(this.getClass());
    
    @Autowired
    private AdminService adminService;    
    @Autowired
    private MenuService menuService;
    @Autowired
    private UserService userService;    
    @Autowired
    private ObjectMapper mapper;


     //수정한 사용자 정보를 DB서버에 반영한다.
     @RequestMapping("/updateGroupAuthList")
     public List<MenuDTO> updateGroupAuthList(HttpServletRequest request,                                      
                                     @RequestBody HashMap<String, Object> map                                    
                                     )throws Exception 
     {
         
         int GROUP_ID = (int)map.get("GROUP_ID");       //그룹 ID를 가져온다.  
         
         
         ArrayList<MenuDTO> menuList3 = mapper.convertValue(map.get("GroupAuthList"), new TypeReference<List<MenuDTO>>() { });
         
         adminService.updateGroupAuthList(menuList3, GROUP_ID);

         //menuUservice.updateUserAuthList(menuList3, UserID);  //메뉴정보를 업데이트 한다.
         return menuList3;
     }


    //그룹의 사용자 정보를 갱신한다.
    @RequestMapping("/updateGroupUserList")
    public CommonDTO updateGroupUserList(HttpServletRequest request,
        @RequestBody HashMap<String, Object> map)throws Exception
    {

        String CREATER_ID = request.getAttribute("UserID").toString();                
        HashMap<String, Object> GroupInfo = (HashMap<String, Object>)map.get("GroupInfo");
        //ArrayList<HashMap<String, Object>> UserList = mapper.convertValue(map.get("GroupUserList"), new TypeReference<ArrayList<HashMap<String, Object>>>() { });
        List<HashMap<String, Object>> UserList = mapper.convertValue(map.get("GroupUserList"), new TypeReference<List<HashMap<String, Object>>>() { });

        adminService.updateGroupUserList((int)GroupInfo.get("GROUP_ID"), CREATER_ID, UserList);

        CommonDTO ret = new CommonDTO();
        ret.setData(map);
        ret.setMsg("그룹 사용자 수정작업이 완료 되었습니다.");
        ret.setRet(true);

    
        return ret;
    }



    //신규그룹정보를 추가한다
    @RequestMapping("/insertNewGroup")
    public CommonDTO insertNewGroup(HttpServletRequest request,@RequestBody HashMap<String, Object> map)throws Exception
    {
        //로그인 정보를 바탕으로 작성자 정보를 생성한다.
        String UserID = request.getAttribute("UserID").toString();
        map.put("CREATER_ID", UserID);

        CommonDTO ret = new CommonDTO();
        ret.setData(map);
        ret.setMsg("그룹 추가작업이 완료 되었습니다.");
        ret.setRet(true);

        adminService.insertNewGroup(map);

        return ret;
    }
    //선택된 그룹정보를 수정한다
    @RequestMapping("/updateGroup")
    public CommonDTO updateGroup(@RequestBody HashMap<String, Object> map)throws Exception
    {
        CommonDTO ret = new CommonDTO();
        ret.setData(map);
        ret.setMsg("그룹 수정작업이 완료 되었습니다.");
        ret.setRet(true);

        adminService.updateGroup(map);
        return ret;
    }

    //선택된 그룹정보를 삭제처리 한다.
    @RequestMapping("/deleteGroup")
    public CommonDTO deleteGroup(@RequestBody HashMap<String, Object> map)throws Exception
    {
        CommonDTO ret = new CommonDTO();
        ret.setData(map);
        ret.setMsg("그룹 삭제작업이 완료 되었습니다.");
        ret.setRet(true);

        adminService.deleteGroup(map);        
        return ret;
    }



    //그룹리스트를 반환한다.
    @RequestMapping("/selectGroupList")
    public List<HashMap<String, Object>> selectGroupList()throws Exception
    {
        return adminService.selectGroupList();
    }

    //사용자 리스트를 반환한다.
    @RequestMapping("/selectUserList")
    public List<HashMap<String, Object>> selectUserList()throws Exception
    {
        return userService.selectUserList();
    }

    @RequestMapping("/selectGroupMenuList")
    public List<MenuDTO> selectGroupMenuList(
        @RequestBody HashMap<String, Object> map)throws Exception
    {
        String GroupID = map.get("GROUP_ID").toString();
        return menuService.selectAuthMenuList_Group(0, GroupID);
    }
    

    //특정 그룹의 사용자 정보를 반환
    @RequestMapping("/selectGroupUserList")
    public List<HashMap<String, Object>> selectGroupUserList(
        @RequestBody HashMap<String, Object> map) {
                
        String GroupID = map.get("GROUP_ID").toString();

        return adminService.selectGroupUserList(GroupID);
    }
    


}


