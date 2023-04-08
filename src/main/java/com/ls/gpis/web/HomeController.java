package com.ls.gpis.web;

import com.ls.gpis.annotation.AuthCheck;
import com.ls.gpis.annotation.AuthCheck.AuthLevel;
import com.ls.gpis.annotation.LoginCheck;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.MenuDTO;
import com.ls.gpis.dto.MenuItemDTO;
import com.ls.gpis.service.LogService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.HomeService;

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


@AuthCheck(MENU_ID=1, LEVEL = AuthLevel.READ)
@RestController
@RequestMapping("/home")
public class HomeController{

    protected Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private HomeService homeService;

    @Autowired
    private LogService logService;

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectLastDate")
    public List<HashMap<String,Object>> selectLastDate(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return homeService.selectLastDate();
    }

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectCoperMoneyList")
    public List<HashMap<String,Object>> selectCoperMoneyList(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return homeService.selectCoperMoneyList();
    }

    //전체 메뉴 리스트를 반환한다.
    @RequestMapping("/selectWorkPlaceMoneyList")
    public List<HashMap<String,Object>> selectWorkPlaceMoneyList(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return homeService.selectWorkPlaceMoneyList();
    }

    @RequestMapping("/selectyearTotalMoney")
    public List<HashMap<String,Object>> selectyearTotalMoney(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return homeService.selectyearTotalMoney();
    }

    @RequestMapping("/selectyearTotalCompany")
    public List<HashMap<String,Object>> selectyearTotalCompany(@RequestBody HashMap<String, Object> searchCond)throws Exception{        

        return homeService.selectyearTotalCompany();
    }
    // //사용자 ID 중복체크
    // @RequestMapping("/checkCoperID")
    // public CommonDTO checkCoperID(@RequestBody HashMap<String, Object> CoperInfo)throws Exception{    

    //     String CoperId = CoperInfo.get("CORPORATE_ID").toString();
    //     if(coperService.checkCoperInfo(CoperInfo))
    //     {
    //         //사용자가 이미 존재하는 경우
    //         return new CommonDTO(false,"아이디 중복 입니다.");
    //     }            
    //     return new CommonDTO(true,"사용할 수 있는 아이디 입니다.");
    // }

    
    // @RequestMapping("/updateCoper")
    // public CommonDTO updateCoper(HttpServletRequest request, @RequestBody HashMap<String, Object> CoperInfo)throws Exception{    

    //     try{
    //         String UserID = request.getAttribute("UserID").toString();
    //         CoperInfo.put("UPDATER_ID", UserID);            
    //         CoperInfo.put("CREATER_ID", UserID);            

    //         if(coperService.updateCoper(CoperInfo) == 1)
    //         {
    //             return new CommonDTO(true, "정상적으로 수정 되었습니다.");    
    //         }
    //         return new CommonDTO(false, "문제가 발생 하였습니다.");    
    //     }catch (Exception e) {
    //         logService.insertErrorLog(request, e);            
    //         return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
    //     }
    // }


    

}