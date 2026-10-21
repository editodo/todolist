// English strings, keyed by the Korean text used in t('...'). Missing keys fall back to Korean.
// Legal documents (약관, 개인정보처리방침), admin screens and server error messages stay Korean.
export default {
    // Tabs & navigation
    '투두리스트': 'To-do', '캘린더': 'Calendar', '마이페이지': 'My page', '홈': 'Home', '뒤로': 'Back',
    '이전': 'Back', '다음': 'Next', '시작': 'Start', '완료': 'Done',
    '인터넷에 연결되어 있지 않아요. 저장되지 않을 수 있어요.': "You're offline. Changes may not be saved.", '확인': 'OK', '취소': 'Cancel', '삭제': 'Delete', '수정': 'Save',
    '알림': 'Notice', '오류': 'Error', '실패': 'Failed', '성공': 'Done',

    // Weekdays
    '일': 'Sun', '월': 'Mon', '화': 'Tue', '수': 'Wed', '목': 'Thu', '금': 'Fri', '토': 'Sat',

    // Reminders
    '할 일 알림': 'To-do reminders',
    '좋은 아침이에요 ☀️': 'Good morning ☀️',
    '오늘의 할 일을 확인해보세요 ✏️': "Check today's to-dos ✏️",
    '오늘 할 일을 적어볼까요?': 'Want to plan your day?',
    '오늘 할 일이 {n}개 있어요. 하나씩 해볼까요? ✏️': 'You have {n} to-dos today. One at a time ✏️',
    '오늘 하루는 어땠나요?': 'How was your day?',
    '기분을 남겨보세요 🙂': 'Leave a note about your mood 🙂',

    // To-do list & calendar
    '하루 기록': 'Daily record', '할 일을 삭제했어요': 'To-do deleted', '되돌리기': 'Undo',
    '할 일을 저장하지 못했습니다.': "Couldn't save the to-do.",
    '카카오로 계속하기': 'Continue with Kakao', '카카오 로그인을 완료하지 못했습니다.': "Couldn't finish Kakao login.",
    'SNS로 시작하기': 'Continue with', '로그인 방식': 'Signed in with',
    '가입하지 못했습니다.': "Couldn't sign up.", '가입이 완료됐어요. 지금까지의 기록도 그대로 이어져요.': "You're signed up. Everything you've written so far comes with you.",
    '지금까지 쓴 기록이 새 계정으로 그대로 이어져요.': 'Everything you\'ve written so far moves to your new account.',
    '로그인하지 않은 상태에서 로그아웃하면 지금까지의 기록을 다시 볼 수 없어요. 계속할까요?': "You're not signed in. If you log out, you won't be able to get these records back. Continue?",
    '로그인하고 기록 백업하기': 'Log in to back up your records', '지금까지의 기록이 그대로 이어지고, 다른 기기에서도 볼 수 있어요': 'Keep everything so far and see it on your other devices',
    '시작하지 못했어요. 잠시 후 다시 시도해주세요.': "Couldn't start. Please try again.", '취향저격 투두리스트 시작하기': 'Get started',
    '닫기': 'Close', '오늘': 'Today', '{n}월': '{n}', '연도·월 선택': 'Choose year and month',
    '이전 날': 'Previous day', '날짜 선택': 'Choose a date', '다음 날': 'Next day',
    '할 일을 입력하세요': 'Write a to-do', '입력 취소': 'Cancel', '날짜를 선택해주세요.': 'Pick a date.',
    '할 일 수정': 'Edit to-do', '눌러서 수정': 'Tap to edit', '{text} 삭제': 'Delete {text}',

    // Daily record
    '오늘의 이야기를 들려주세요!': 'Tell us about your day!',
    '오늘 하루 요약 스티커를 골라주세요!': 'Pick a sticker for today!',
    '저장 실패': 'Save failed', '저장하지 못했습니다: {msg}': "Couldn't save: {msg}",
    '기록 삭제': 'Delete record', '이 날의 기록을 지울까요?': "Delete this day's record?",
    '삭제하지 못했습니다.': "Couldn't delete.",
    '오늘 하루를 기록해요': 'Record your day',
    '투두리스트는 잘 지켜졌는지, 기분은 어떤지 적어봐요.': 'How did your to-dos go? How do you feel?',
    '오늘 하루 기록': "Today's record", '오늘 하루 요약 스티커': "Today's sticker",
    '저장 중...': 'Saving...', '기록 완료': 'Save record',
    '기록 수정': 'Edit', '목록': 'List', '오늘 한 일': 'Done today', '시간': 'Time', '기록 보기': 'View record',
    '이 날 완료한 할 일이 없어요.': 'No completed to-dos on this day.', '할 일을 불러오지 못했어요.': "Couldn't load your to-dos.",

    // Fonts & language
    '기본 글씨체': 'Default (Noto Sans KR)', '글꼴 변경': 'Font',
    '글꼴을 불러오지 못했어요. 잠시 후 다시 시도해주세요.': "Couldn't load the font. Please try again later.",
    '적용하기': 'Apply', '언어': 'Language', '휴대폰 설정 따르기': 'Use device language',

    // Inquiry & notices
    '[EdiTodo 문의]': '[EdiTodo inquiry]', '메일 앱을 열 수 없습니다': "Couldn't open your mail app",
    '{email} 로 직접 메일을 보내주세요.': 'Please email {email} directly.',
    '문의하기': 'Contact us', '문의 메일 주소': 'Support email',
    '아래 내용을 적고 버튼을 누르면 메일 앱이 열립니다. 답변은 보내신 메일 주소로 드립니다.': "Write your message below and tap the button to open your mail app. We'll reply to the address you send from.",
    '문의 내용': 'Message', '내용을 입력하세요.': 'Write your message.', '메일로 문의하기': 'Email us',
    '등록된 공지사항이 없습니다.': 'No announcements yet.', '공지사항': 'Announcements',

    // Sign up / log in
    '약관 동의': 'Terms', '이용약관과 개인정보처리방침에 동의해주세요.': 'Please agree to the Terms and Privacy Policy.',
    '비밀번호 불일치': "Passwords don't match", '비밀번호와 비밀번호 확인이 다릅니다.': "The passwords don't match.",
    '가입 성공': 'Welcome!', '회원가입이 완료되었습니다.': 'Your account is ready.', '가입 실패': 'Sign-up failed',
    '서버 연결에 실패했습니다.': "Couldn't reach the server.",
    '회원가입': 'Sign up', '아이디': 'ID', '영문, 숫자, _ 조합 4~20자': '4–20 letters, numbers or _',
    '이메일': 'Email', '비밀번호': 'Password', '8자 이상': 'At least 8 characters', '비밀번호 확인': 'Confirm password',
    '비밀번호가 일치하지 않습니다.': "Passwords don't match.",
    '닉네임 (선택)': 'Nickname (optional)', '비워두면 자동으로 만들어져요': "We'll pick one if you leave it empty",
    '이용약관과 개인정보처리방침 동의': 'Agree to the Terms and Privacy Policy',
    '이용약관': 'Terms of Service', '과': ' and', '개인정보처리방침': 'Privacy Policy',
    '에 동의합니다. (만 14세 이상)': ': I agree (age 14+).', '가입': 'Sign up',
    '로그인 성공': 'Logged in', '환영합니다 {name}님!': 'Welcome, {name}!', '로그인 실패': 'Login failed', '로그인': 'Log in',
    '아이디/비밀번호 찾기': 'Find ID / password', '로그인에 실패했습니다.': 'Login failed.',
    'Apple 로그인을 완료하지 못했습니다.': "Couldn't finish signing in with Apple.",
    'Google 로그인을 완료하지 못했습니다.': "Couldn't finish signing in with Google.",
    '또는': 'or', 'Google로 계속하기': 'Continue with Google', 'Apple로 계속하기': 'Continue with Apple',

    // Password reset
    '가입한 이메일을 입력해주세요.': 'Enter the email you signed up with.',
    '가입한 이메일로 아이디와 인증 코드를 보내드립니다. 코드를 입력하면 새 비밀번호를 정할 수 있습니다.': "We'll email your ID and a code. Enter the code to set a new password.",
    '로그인하러 가기': 'Go to log in', '보내는 중...': 'Sending...', '인증 코드 받기': 'Send code',
    '인증 코드 (6자리)': 'Code (6 digits)', '메일로 받은 숫자 6자리': '6-digit code from the email',
    '새 비밀번호': 'New password', '새 비밀번호 확인': 'Confirm new password', '한 번 더 입력': 'Type it again',
    '변경 중...': 'Changing...', '비밀번호 변경': 'Change password',
    '메일이 오지 않았나요? 코드 다시 받기': "Didn't get it? Send again",
    '가입한 이메일이 기억나지 않으면 문의하기': "Forgot your email? Contact us",

    // My page & account
    '체험계정을 종료하시겠습니까? 데이터가 유실될 수 있습니다.': 'End the trial? Your data may be lost.',
    '로그아웃 하시겠습니까?': 'Log out?', '로그아웃': 'Log out',
    '체험계정을 종료하면 데이터가 삭제될 수 있습니다. 계속하시겠습니까?': 'Ending the trial may delete your data. Continue?',
    '계정과 모든 할 일, 일기, 설정이 즉시 삭제되며 복구할 수 없습니다. 탈퇴하시겠습니까?': 'Your account and all to-dos, records and settings will be deleted for good. Delete account?',
    '회원 탈퇴': 'Delete account', '탈퇴': 'Delete', '회원 탈퇴에 실패했습니다.': "Couldn't delete the account.",
    '아이디, 비밀번호, 이메일은 필수입니다.': 'ID, password and email are required.',
    '정회원으로 전환되었습니다!': "You're now a member!", '계정 전환에 실패했습니다.': "Couldn't convert the account.",
    '로그인/회원가입': 'Log in / Sign up',
    '체험 기간 {n}일 남음': '{n} trial days left', '체험 기간이 끝났어요': 'Your trial has ended',
    '정회원으로 전환하면 지금까지의 기록이 그대로 유지돼요': 'Become a member to keep everything you wrote',
    '테마 및 색상 변경': 'Theme & colors', '알림 설정': 'Reminders', '개인정보 정책': 'Privacy Policy',
    '버전 정보': 'Version', '체험 종료 (로그아웃)': 'End trial (log out)',
    '정회원 전환': 'Become a member', '체험 계정의 데이터를 그대로 유지합니다.': 'Your trial data stays.',
    '사용할 아이디': 'ID', '사용할 닉네임 (선택)': 'Nickname (optional)', '전환하기': 'Convert',
    '닉네임을 입력해주세요.': 'Enter a nickname.', '회원정보를 수정하지 못했습니다.': "Couldn't update your profile.",
    '회원정보 수정': 'Edit profile', '닉네임': 'Nickname',

    // Reminder settings
    '오전': 'AM', '오후': 'PM',
    '휴대폰 설정에서 EdiTodo 알림이 꺼져 있어요. 알림을 받으려면 설정에서 켜주세요.': 'EdiTodo notifications are off in your phone settings. Turn them on to get reminders.',
    '설정 열기': 'Open settings',
    '알림은 이 기기에만 적용돼요. 앱을 2주 넘게 열지 않으면 알림이 멈추고, 다시 열면 이어서 울려요.': "Reminders apply to this device only. They pause if you don't open the app for 2 weeks and resume when you do.",
    '알림 시간': 'Reminder time',
    '아침 할 일 알림': 'Morning to-do reminder', '저녁 일기 알림': 'Evening record reminder',
    '오늘 남은 할 일 개수를 알려드려요. 다 끝낸 날은 울리지 않아요.': "Tells you how many to-dos are left. Skipped on days you've finished.",
    '하루 기분을 남기도록 알려드려요. 일기를 쓴 날은 울리지 않아요.': "Reminds you to record your day. Skipped once you've written it.",

    // Onboarding
    '체험판 시작에 실패했습니다.': "Couldn't start the trial.", '반가워요!': 'Hello!',
    '쉽게 ': 'Just ', '1분': '1 minute', '만 투자해서,': ' to create', '취향 저격': 'your perfect', '인': '',
    '나만의 EdiTodo': 'EdiTodo', ' 제작!': '!',
    '취향저격 투두리스트 체험판': 'Try EdiTodo free', '아이디가 있다면?': 'Have an account?', '로그인하기': 'Log in',

    // Theme setup
    '내 마음에 드는\n테마를 골라볼까요?': 'Pick a theme\nyou like',
    '나중에 마이페이지에서 수정할 수 있어요.\n더 많은 테마는 E-T에서 열심히 준비 중이에요!': 'You can change it later in My page.\nMore themes are on the way!',
    '화면 모드': 'Appearance', '테마': 'Theme', '테마 미리보기': 'Preview',
    '라이트': 'Light', '다크': 'Dark', '시스템': 'System',
    '심플': 'Simple', '라운드': 'Round', '스케치': 'Sketch', '키치': 'Kitsch',
    '민초': 'Mint choco', '레몬': 'Cherry lemon', '그린': 'Green', '핑키': 'Pinky',
    ' 테마의 추천 색상!\n좋아하는 색상으로 골라봐요 :)': ' theme colors!\nPick the one you like :)',
    '나중에 마이페이지에서 수정할 수 있어요.\n[배경색/포인트색] 원하는 색상을 아래에서 골라봐요!': 'You can change it later in My page.\n[Background / accent] Choose below!',
    '나만의 Todolist 생성 완료!\n아래의 테마가 맞는지 확인해 주세요.': 'Your to-do list is ready!\nCheck the theme below.',
    '매일 아침 9시에 오늘 할 일을 알려드릴까요?': "Remind me of today's to-dos at 9 AM",
    '테마선택': 'Theme', '색상선택': 'Colors', '선택확인': 'Confirm',

    // Theme preview sample to-dos
    '하루에 4번 사랑을 말하기': 'Say "I love you" 4 times',
    '밥 먹고 30분 산책 다녀오기': 'Take a 30-minute walk after lunch',
    '8번 웃기': 'Laugh 8 times', '키스 6번 하기': 'Give 6 kisses',
};
