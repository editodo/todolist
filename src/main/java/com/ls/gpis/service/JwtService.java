package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JwtService {

    Logger logger = LoggerFactory.getLogger(this.getClass());
    
    private final String KEY = "aaaa";      //JWT Key(절때루 유출되면 안됨이야...)
    private final int TokenTimeout = 1000 * 60 * 500;  //(기본적으로 15분)


    @Autowired
    private MenuService menuService;

    //JWT타임아웃 시간(초)를 반환한다.
    public int GetJWTTimeoutSec()
    {
        return TokenTimeout / 1000;
    }

    // JWT토큰을 생성한다.
    public String makeJwt(String UserID) throws Exception {

        List<HashMap<String, Object>> lists = menuService.selectAuthList(UserID);
        
        Map<String, Object> map = new HashMap<String, Object>();
        
        map.put("UserID", UserID);      //사용자 ID를 입력한다.
        map.put("MenuAuth", lists);     //사용자 권한 정보를 입력한다.


        String jwtString = Jwts.builder().setHeaderParam("typ", "JWT")
                .setHeaderParam("issueDate", System.currentTimeMillis())
                .setSubject("내용").setClaims(map)
                .setExpiration(new Date(System.currentTimeMillis() + (TokenTimeout)))            //타임아웃 시간 지정                
                .signWith(SignatureAlgorithm.HS512, KEY).compact();

        return jwtString;
    }

    // 사용 가능한 토큰인지 체크 한다.
    public boolean isUsableToken(String tokenString) {
        logger.debug("isUsableToken");

        try {

            Jwts.parser().setSigningKey(KEY).parseClaimsJws(tokenString);
        
            //OK, we can trust this JWT
        
        } catch (JwtException e) {
        
            return false;
            //don't trust the JWT!
        }

        return true;        
    }

    //토큰 체크(토큰이 만려 되었는지 변조 되었는지 확인한다.)
    public boolean checkJwt(String jwt) throws Exception {
        try {
            logger.debug(jwt);
            Claims claims = Jwts.parser().setSigningKey(KEY)
                    .parseClaimsJws(jwt).getBody(); // 정상 수행된다면 해당 토큰은 정상토큰
                    
            logger.info("expireTime :" + claims.getExpiration());
            //logger.info("name :" + claims.get("name"));
            //logger.info("Email :" + claims.get("email"));

            return true;
        } catch (ExpiredJwtException exception) {
            logger.info("토큰 만료");
            return false;
        } catch (JwtException exception) {
            logger.info("토큰 변조");
            return false;
        }
    }

    //JWT토큰의 상태를 반환한다.
    //return 0 : 정상
    //return 1 : 토큰만료
    //return 2 : 토큰변조
    public int checkJwt2(String jwt){
        try {
            Claims claims = Jwts.parser().setSigningKey(KEY)
                    .parseClaimsJws(jwt).getBody(); // 정상 수행된다면 해당 토큰은 정상토큰

            return 0;
        } catch (ExpiredJwtException exception) {
            logger.info("토큰 만료");
            return 1;
        } catch (JwtException exception) {
            logger.info("토큰 변조");
            return 2;
        }
    }

    //권한정보를 반환한다.
    public List<HashMap<String,Object>> GetMenuAuth(String jwt)
    {
        try {
            Claims claims = Jwts.parser().setSigningKey(KEY)
                    .parseClaimsJws(jwt).getBody(); // 정상 수행된다면 해당 토큰은 정상토큰
                    
            return (List<HashMap<String,Object>>)claims.get("MenuAuth");
                
        } catch (ExpiredJwtException exception) {
            logger.info("토큰 만료");
        
        } catch (JwtException exception) {
            logger.info("토큰 변조");
        
        }

        return null;
    }

    //JWT토큰에서 사용자 정보를 가져온다.
    public String GetUserID(String jwt)
    {
        try {
            Claims claims = Jwts.parser().setSigningKey(KEY)
                    .parseClaimsJws(jwt).getBody(); // 정상 수행된다면 해당 토큰은 정상토큰
                    
            return claims.get("UserID").toString();
                
        } catch (ExpiredJwtException exception) {
            logger.info("토큰 만료");
        
        } catch (JwtException exception) {
            logger.info("토큰 변조");
        
        }

        return "";
    }

}