package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import com.ls.gpis.dto.MenuDTO;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//그룹 관련 정보에 대한 DAO
@Repository
public class GroupDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;

      //메뉴 권한 정보를 업데이트 한다.      
      public int updateGroupAuthLevelMenu(MenuDTO menuItem, int GROUP_ID) throws Exception
      {
        HashMap<String,Object> param = new HashMap<String,Object>();
        
        param.put("AUTH_LEVEL", menuItem.getAuth_level());
        param.put("GROUP_ID", GROUP_ID);
        param.put("MENU_ID", menuItem.getId());

        return sqlSession.update("com.ls.gpis.framework.group.updateGroupAuthLevelMenu", param);
      }



    //특정 그룹의 사용자 맵핑 정보를 추가한다.
    public int insertGroupUserList(HashMap<String, Object> GROUP_MAP_INFO){        
        return sqlSession.insert("com.ls.gpis.framework.group.insertGroupUserList", GROUP_MAP_INFO);
    }

    //특정 그룹의 사용자 정보를 삭제한다.
    public int deleteGroupUserList(int GroupID){
        return sqlSession.delete("com.ls.gpis.framework.group.deleteGroupUserList", GroupID);
    }

    //현재 등록 된 그룹 리스트를 반환한다.
    public List<HashMap<String, Object>> selectGroupList(){

        return sqlSession.selectList("com.ls.gpis.framework.group.selectGroupList");
    }

    //그룹에 포함된 사용자 정보를 반환한다.
    public List<HashMap<String, Object>> selectGroupUserList(String GroupID)
    {
        return sqlSession.selectList("com.ls.gpis.framework.group.selectGroupUserList", GroupID);
    }

    //신규 그룹정보를 추가한다.
    public int insertNewGroup(HashMap<String,Object> data){
        sqlSession.insert("com.ls.gpis.framework.group.insertNewGroup", data);
        
        return (int)data.get("GROUP_ID");   //생성된 ID값을 반환한다.
    }

    //그룹정보를 수정한다.
    public int updateGroup(HashMap<String,Object> data){
        return sqlSession.update("com.ls.gpis.framework.group.updateGroup", data);
    }

    //그룹정보를 삭제한다.
    public int deleteGroup(HashMap<String,Object> data)
    {
        return sqlSession.update("com.ls.gpis.framework.group.deleteGroup", data);
    }    

}