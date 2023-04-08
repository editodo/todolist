package com.ls.gpis.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;


//import com.ls.gpis.dao.DeptDAO;
//import com.ls.gpis.dao.UserDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class BatchService{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    //@Autowired
    //private UserDAO userDAO;        //사용자 정보 DAO

    //@Autowired
    //private DeptDAO deptDAO;        //부서정보 DAO
    
    //사용자 정보를 인사시스템과 동기화 시킨다.
    @Transactional
    public void procUserInfo(String yyyymmdd){
        
        //사용안함  2022-07-13
        /*
        List<HashMap<String, Object>> list = userDAO.selectIFEmpUserList(yyyymmdd); //Sync정보를 가져온다.

        if(list.size() > 100)   //에러방지(조회된 건수가 100건 이상일경우에만 배치가 돌아가도록 함)
        {
            for (HashMap<String, Object> userInfo : list) {
                userDAO.updateUserList(userInfo);       //사용자 정보 추가/갱신
                logger.debug(userInfo.get("EMP_HNAME").toString());
            }            
            userDAO.syncDisableEmpUsers(yyyymmdd);  //불필요한 아이디 비활성화
        }       

         */
    }


    //부서정보를 인사시스템과 동기화 시킨다.
    @Transactional
    public void procDeptInfo(String yyyymmdd){

        //사용안함  2022-07-13
        /*
        List<HashMap<String, Object>> list = deptDAO.selectHRDeptList(yyyymmdd); //Sync정보를 가져온다.

        if(list.size() > 10)   //에러방지(조회된 건수가 10건 이상일경우에만 배치가 돌아가도록 함)
        {
            for (HashMap<String, Object> deptInfo : list) {
                deptDAO.updateDeptList(deptInfo);       //부서정보 추가/갱신
                logger.debug(deptInfo.get("DEPT_NAME").toString());
            }            
            deptDAO.syncDisableDept(yyyymmdd);  //불필요한 부서정보 비활성화
        }
         */

    }

}