package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import com.ls.gpis.dao.UserDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.SHA256Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService{
    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    private UserDAO userDAO;        //사용자 정보 DAO

    //사용자 ID와 패스워드가 맞는지 검증한다.
    //true : 패스워드 검증 통과 false : 패스워드 검증 실패
    public boolean CheckPassword(String UserId, String Password)
    {
        Map<String, Object> map = userDAO.selectUserInfo(UserId);   //DB에서 사용자 정보를 가져온다.
        
        if(map == null) return false;   //사용자가 없는 경우...

        String savedPassword = (String)map.get("PASSWORD");             //패스워드를 가져온다.

        String sha256pass = SHA256Util.getEncrypt(Password, "").toUpperCase();
        
        return sha256pass.equals(savedPassword.toUpperCase());          //패스워드가 맞는지 확인
    }


    //사용자 기본 리스트 정보를 반환한다.
    public List<HashMap<String,Object>> selectUserBaseInfoList()
    {
        return userDAO.selectUserBaseInfoList();
    }

    //사용자 리스트를 반환한다.
    public List<HashMap<String,Object>> selectUserList()
    {
        return userDAO.selectUserList();
    }

    //검색조건에 맞는 사용자 리스트를 반환한다.
    public List<HashMap<String,Object>> selectUserListCond(HashMap<String, Object> SearchCond)
    {
        return userDAO.selectUserListCond(SearchCond);
    }


    //시용자 정보를 가져온다.
    public HashMap<String,Object> selectUserInfo(String UserId)
    {
        HashMap<String, Object> map = userDAO.selectUserInfo(UserId);   //DB에서 사용자 정보를 가져온다.
        if(map != null)  map.put("PASSWORD", "");    //패스워드는 리셋 시킨다.(패스워드는 노출 시키지 않는다.)
        return map;                 //사용자 정보를 반환한다.
    }

    //사용자가 리스트에 존재 하는지 확인
    public Boolean checkUserInfo(String UserId)
    {
        if(userDAO.selectUserInfo(UserId) == null) return false;

        return true;
    }

    //로컬 사용자를 추가한다.
    public int insertLocalUser(HashMap<String, Object> UserInfo)
    {
        //패스워드는 sha256으로 변환        
        String Pass = UserInfo.get("PASSWORD").toString();
        String sha256pass = SHA256Util.getEncrypt(Pass, "").toUpperCase();
        UserInfo.put("PASSWORD", sha256pass);


        return userDAO.insertLocalUser(UserInfo);
    }


    //로컬 사용자 정보를 수정한다.
    public int updateUser(HashMap<String, Object> UserInfo)
    {
        return userDAO.updateUser(UserInfo);        
    }
    

    //패스워드를 강제적으로 변경한다
    public CommonDTO ChangePassword(String UserID, String ChangePassword)
    {
        //입력한 파라메터 정보를 확인한다.
        if(UserID == null || UserID.trim().length() == 0 )
        {
            return new CommonDTO(false, "계정정보를 확인 할 수 없습니다.");        
        } 

        if(ChangePassword == null || ChangePassword.trim().length() == 0 )
        {
            return new CommonDTO(false, "변경 패스워드 정보를 확인 할 수 없습니다.");        
        }


        //패스워드를 변경한다.
        String Sha256Password = SHA256Util.getEncrypt(ChangePassword, "").toUpperCase();
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("EMP_USER_ID", UserID);
        map.put("PASSWORD", Sha256Password);
        int ret = userDAO.updateUserPassword(map);
        if(ret == 1)
        {
            return new CommonDTO(true, "패스워드가 변경 되었습니다.");            
        }
        
        return new CommonDTO(false, "문제가 발생 하였습니다.");        
    }


    //패스워드 변경 처리를 한다.
    public CommonDTO PasswordChangeUser(String UserID,                  //사용자ID
                                        String OrgPassword,             //원래 패스워드
                                        String ChangePassword,          //변경할 패스워드
                                        String ChangePasswordConfirm)   //변경할 패스워드 확인용
    {

        //입력한 파라메터 정보를 확인한다.
        if(UserID == null || UserID.trim().length() == 0 )
        {
            return new CommonDTO(false, "계정정보를 확인 할 수 없습니다.");        
        } 
        
        if(OrgPassword == null || OrgPassword.trim().length() == 0 )
        {
            return new CommonDTO(false, "현재 패스워드 정보를 확인 할 수 없습니다.");        
        }
        
        if(ChangePassword == null || ChangePassword.trim().length() == 0 )
        {
            return new CommonDTO(false, "변경 패스워드 정보를 확인 할 수 없습니다.");        
        }

        if(ChangePasswordConfirm == null || ChangePasswordConfirm.trim().length() == 0 )
        {
            return new CommonDTO(false, "변경 패스워드 확인 정보를 확인 할 수 없습니다.");        
        }

        //패스워드 확인 정보가 일치 하지 않음
        if(!ChangePassword.equals(ChangePasswordConfirm))
        {
            return new CommonDTO(false, "패스워드 확인 정보가 일치 하지 않습니다.");        
        }
        
        //패스워드를 체크 한다.
        if(this.CheckPassword(UserID, OrgPassword) == false)
        {
            //로그인이 안된다.
            return new CommonDTO(false, "현재 패스워드를 확인 바랍니다.");        
        }

        //패스워드를 변경한다.
        String Sha256Password = SHA256Util.getEncrypt(ChangePasswordConfirm, "").toUpperCase();
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("EMP_USER_ID", UserID);
        map.put("PASSWORD", Sha256Password);
        int ret = userDAO.updateUserPassword(map);
        if(ret == 1)
        {
            return new CommonDTO(true, "패스워드가 변경 되었습니다.");            
        }

        return new CommonDTO(false, "문제가 발생 하였습니다.");        
    }
    
   

}