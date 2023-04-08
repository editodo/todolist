package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class UserDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;


    //사용자 정보를 추가/갱신 한다
    public int updateUserList(HashMap<String,Object> UserInfo){
        
        return sqlSession.update("com.ls.gpis.framework.user.updateEmpUser", UserInfo);
    }

    //로컬 사용자를 추가한다.
    public int insertLocalUser(HashMap<String,Object> UserInfo){
        return sqlSession.insert("com.ls.gpis.framework.user.insertLocalUser", UserInfo);
    }

    //로컬 사용자를 수정한다.
    public int updateUser(HashMap<String,Object> UserInfo){
        return sqlSession.update("com.ls.gpis.framework.user.updateUser", UserInfo);
    }
    
    // public int actupdate()
    // {

    // }

    //사용자 정보를 가져온다.
    public HashMap<String, Object> selectUserInfo(String UserID){
                      
        return sqlSession.selectOne("com.ls.gpis.framework.user.selectUser", UserID);
    }

    //사용자 기본정보 리스트를 가져온다.
    public List<HashMap<String, Object>> selectUserBaseInfoList(){
                      
        return sqlSession.selectList("com.ls.gpis.framework.user.selectUserBaseInfoList");
    }

    //사용자 리스트를 반환한다.
    public List<HashMap<String, Object>> selectUserList(){

        return sqlSession.selectList("com.ls.gpis.framework.user.selectUserList_nopass");
        
    }


    //검색조건에 맞는 사용자 리스트를 반환한다.
    public List<HashMap<String, Object>> selectUserListCond(HashMap<String, Object> SearchCond){
        return sqlSession.selectList("com.ls.gpis.framework.user.selectUserListCond", SearchCond);        
    }

    //사용자 패스워드 정보를 수정한다.
    public int updateUserPassword(HashMap<String,Object> UserInfo)
    {
        return sqlSession.update("com.ls.gpis.framework.user.updateUserPassword", UserInfo);
    }

    
  



}