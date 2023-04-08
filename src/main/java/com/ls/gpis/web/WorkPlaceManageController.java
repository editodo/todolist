package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.WorkPlaceService;

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


@AuthCheck(MENU_ID=100, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/workplacemanage")
public class WorkPlaceManageController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private WorkPlaceService workPlaceService;

    @Autowired
    private LogService logService;

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectWorkPlaceList")
    public List<HashMap<String,Object>> selectWorkPlaceList(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return workPlaceService.selectWorkPlaceList(searchCond);
    }

    //사용자 ID 중복체크
    @RequestMapping("/checkWorkPlaceID")
    public CommonDTO checkWorkPlaceID(@RequestBody HashMap<String, Object> WorkPlaceInfo)throws Exception{    

        //String CoperId = WorkPlaceInfo.get("CORPORATE_ID").toString();
        if(workPlaceService.checkWorkPlaceInfo(WorkPlaceInfo))
        {
            //사용자가 이미 존재하는 경우
            return new CommonDTO(false,"아이디 중복 입니다.");
        }            
        return new CommonDTO(true,"사용할 수 있는 아이디 입니다.");
    }

    
    @RequestMapping("/updateWorkPlace")
    public CommonDTO updateWorkPlace(HttpServletRequest request, @RequestBody HashMap<String, Object> WorkPlaceInfo)throws Exception{    

        try{
            String UserID = request.getAttribute("UserID").toString();
            WorkPlaceInfo.put("UPDATER_ID", UserID);            
            WorkPlaceInfo.put("CREATER_ID", UserID);            

            if(workPlaceService.updateWorkPlace(WorkPlaceInfo) == 1)
            {
                return new CommonDTO(true, "정상적으로 수정 되었습니다.");    
            }
            return new CommonDTO(false, "문제가 발생 하였습니다.");    
        }catch (Exception e) {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }


    

}