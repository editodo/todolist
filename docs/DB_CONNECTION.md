# 운영 DB 접속 방법

EdiTodo 운영 DB는 운영 서버(152.69.225.91) 안의 MariaDB에 있습니다. 같은 서버를 dubuck도 함께 씁니다.

DB 포트(3306)는 **외부에서 직접 접속할 수 없도록 막혀 있습니다**(2026-10-22). 서버 밖에서는 반드시 **SSH 터널**을 거쳐 접속하세요. 터널은 SSH로 로그인한 뒤 그 서버 안에서 DB에 붙는 방식이라, DB 포트를 인터넷에 열지 않아도 됩니다.

## 접속 정보

| 항목 | 값 |
|---|---|
| SSH 서버 | `ubuntu@152.69.225.91` (포트 22) |
| SSH 키 | `~/.ssh/editodo_deploy` |
| DB 호스트 (서버 안에서) | `127.0.0.1:3306` |
| DB 이름 | `editodo` |
| DB 계정 | `editodo` (서버 안에서만 접속되는 계정) |
| DB 비밀번호 | 서버의 `/var/www/editodo/server/.env` 안 `DB_PASSWORD` |

비밀번호는 이 문서나 채팅, 커밋에 적지 마세요. 서버에서 확인하려면:
```bash
ssh -i ~/.ssh/editodo_deploy ubuntu@152.69.225.91 'grep DB_PASSWORD /var/www/editodo/server/.env'
```

## 1. 로컬 개발 서버에서 쓰기

터미널 하나에서 터널을 열고, 개발하는 동안 계속 켜 둡니다.
```bash
ssh -i ~/.ssh/editodo_deploy -N -L 3307:127.0.0.1:3306 ubuntu@152.69.225.91
```
- 이 컴퓨터의 `3307` 포트가 서버 DB(`3306`)로 연결됩니다.
- 로컬에 MariaDB가 있어도 겹치지 않게 3307을 씁니다.

`server/.env`:
```
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=editodo
DB_PASSWORD=(서버 .env와 같은 값)
DB_NAME=editodo
```

> ⚠️ 로컬에서 하는 작업이 **실제 운영 데이터**에 바로 반영됩니다.
> - 테스트로 만든 계정은 꼭 지우세요.
> - 로컬 서버를 켤 때 실행되는 표 구조 변경(`server/index.js`)도 운영 DB에 적용됩니다.

## 2. DB 관리 프로그램(DBeaver, HeidiSQL, DataGrip 등)으로 보기

프로그램의 **SSH 터널** 기능을 쓰면 터미널 없이도 접속됩니다.

**DBeaver 기준**
1. 새 연결 → **MariaDB**
2. **Main 탭**
   - Host `127.0.0.1`, Port `3306`
   - Database `editodo`
   - Username `editodo`, Password는 서버 `.env`의 값
3. **SSH 탭** → "Use SSH Tunnel" 켜기
   - Host `152.69.225.91`, Port `22`
   - User `ubuntu`
   - Authentication: **Public Key** → Private key 파일에 `editodo_deploy` 지정
4. Test Connection

**JDBC 주소로 넣는 경우** (위의 1번 터미널 터널을 연 상태에서):
```
jdbc:mariadb://127.0.0.1:3307/editodo
```
예전처럼 `jdbc:mariadb://152.69.225.91:3306/`로 직접 붙는 방식은 이제 연결되지 않습니다.

**dubuck DB**를 볼 때도 같은 방법을 쓰고, DB 이름과 계정만 dubuck 것으로 바꾸면 됩니다.

## 3. 서버에 직접 들어가서 보기

```bash
ssh -i ~/.ssh/editodo_deploy ubuntu@152.69.225.91
sudo mysql editodo        # root로 바로 접속
```

## 방화벽 설정 (참고)

- 서버 방화벽(iptables)에 "서버 자신(`lo`)이 아닌 곳에서 오는 3306 접속은 차단" 규칙이 있습니다.
- 서버를 재부팅해도 유지되도록 `/etc/iptables/rules.v4`에 저장되어 있습니다.
- 서버 안의 프로그램은 DB에 **반드시 `127.0.0.1`로** 접속해야 합니다. 서버 자기 공인 IP(152.69.225.91)로 접속하면, 오라클에서는 그 연결이 외부를 거쳐 들어와 위 규칙에 막힙니다. 2026-10-22에 dubuck이 이 이유로 DB에 접속하지 못했고, dubuck의 `DB_HOST`를 `127.0.0.1`로 바꿔 해결했습니다.

```bash
# 규칙 확인
sudo iptables -S INPUT | grep 3306
# (꼭 필요할 때만) 다시 열기
sudo iptables -D INPUT -p tcp --dport 3306 ! -i lo -j DROP && sudo netfilter-persistent save
```

Oracle Cloud 콘솔의 보안 목록(Security List)에도 3306 허용 규칙이 있다면 지워 두는 것이 좋습니다. 그곳에서도 막으면 이중으로 막힙니다.
