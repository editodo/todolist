package com.ls.gpis;

import java.util.*;

import com.ls.gpis.dao.GroupDAO;
import com.ls.gpis.dao.UserDAO;
import com.ls.gpis.service.BatchService;
import com.ls.gpis.service.JwtService;
import com.ls.gpis.service.MenuService;
import com.ls.gpis.service.UserService;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RunWith(SpringRunner.class)
@SpringBootTest
public class FramewApplicationTests {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserDAO userDao;
	
	@Autowired
	private MenuService menuService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private GroupDAO groupDAO;
	
	@Autowired
	private UserService userService;

	@Autowired
	private BatchService batchService;


	
	//groupDAO 테스트
	public void GroupTest() throws Exception
	{
		HashMap<String, Object> data = new HashMap<String, Object>();

		data.put("GROUP_NAME", "Test Group");
		data.put("CREATER_ID", "admin");

		int ret = groupDAO.insertNewGroup(data);

		data.put("GROUP_ID", ret);
		data.put("GROUP_NAME", "테스트 그룹");


		groupDAO.updateGroup(data);

		groupDAO.deleteGroup(data);
		
	}

	@Test
	public void JwtTest2() throws Exception{
		
		//String str = jwtService.makeJwt("admin");
		//logger.info(str);
		
	}




	public void contextLoads() {		

	}


	public void jwtTest() {

		Map<String, Object> map= new HashMap<String, Object>();

		map.put("test", "test1234");
		map.put("test2", "test12345");

		String jwtString = Jwts.builder()
				.setHeaderParam("typ", "JWT")
				.setHeaderParam("issueDate", System.currentTimeMillis())
				.setSubject("내용")
				.setClaims(map)
				.signWith(SignatureAlgorithm.HS512, "aaaa").compact();

		logger.info(jwtString);
	}


	
	public void dbTest() {

		Map<String, Object> map =  userDao.selectUserInfo("admin");

		String aaa = map.get("EMP_NAME").toString();

		logger.info(aaa);
	}



	//@Test
	public void ifEmpselectTest(){
		batchService.procUserInfo("20190925");


		

		//List<HashMap<String, Object>> list = userDao.selectIFEmpUserList("20190925");

		
		//logger.info( String.valueOf(list.size()) );


	}
	


}
