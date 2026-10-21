/**
 * 재외동포청(OKA) 웹 앱 동작 스크립트 (Pure Vanilla JS)
 * - 로컬 파일(file://) 환경에서 오류 없이 단독 실행
 * - 모바일 네비게이션 토글, 스크롤 인터랙션, Q&A 아코디언, 맞춤 서비스 찾기 시뮬레이터
 */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. 모바일 햄버거 메뉴 토글 */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // 메뉴 항목 클릭 시 메뉴 닫기
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /* 2. 스크롤에 따른 내비게이션 활성화 (Scrollspy) */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });

  /* 3. 자주 묻는 질문(FAQ) 아코디언 */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // 다른 열린 아코디언 닫기
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
          otherItem.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      // 현재 아코디언 토글
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });

  // 첫 번째 아코디언 항목 기본 열림 처리
  if (accordionHeaders.length > 0) {
    accordionHeaders[0].click();
  }

  /* 4. 맞춤 서비스 찾기 시뮬레이터 */
  const findBtn = document.getElementById('findServiceBtn');
  const userTypeSelect = document.getElementById('userType');
  const needTypeSelect = document.getElementById('needType');
  const resultContainer = document.getElementById('finderResult');
  const resultDept = document.getElementById('resultDept');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultContact = document.getElementById('resultContact');

  // 맞춤 매핑 데이터베이스
  const serviceDatabase = {
    'civil': {
      dept: '재외동포서비스지원센터 (통합민원실)',
      title: '원스톱 복합 민원 서비스 (국적·가족관계·비자·아포스티유)',
      desc: '해외 거주 또는 국내 입국 시 발생하는 국적회복/상실 신고, 가족관계증명서 발급, 사증(F-4 등) 발급, 서류 아포스티유 인증을 외교부·법무부 파견 공무원이 한 자리에서 처리합니다.',
      contact: '📍 서울 종로구 율곡로 6 트윈트리타워 A동 15층 | 📞 02-6747-0404'
    },
    'education': {
      dept: '차세대동포과 & 교육지원팀',
      title: '재외동포 한글학교 육성 및 차세대 모국 연수 프로그램',
      desc: '해외 거주 한인 차세대들의 모국어 교육과 한민족 정체성 함양을 위해 전 세계 한글학교 운영비 지원, 교원 역량 강화 연수, 청소년·대학생 모국 방문 체험 연수를 운영합니다.',
      contact: '🌐 재외동포포털 지원사업 공모 또는 주관 부서 안내 | 📞 032-585-3200'
    },
    'business': {
      dept: '동포경제인네트워크과',
      title: '세계한인비즈니스대회(한상) 및 글로벌 비즈니스 매칭',
      desc: '전 세계 거주 한인 경제인과 국내 유망 중소·벤처기업을 잇는 글로벌 경제 네트워크입니다. 1:1 비즈니스 수출 상담회, 스타트업 피칭 대회, 해외 취업 연계 프로그램을 지원합니다.',
      contact: '🏢 인천 송도 본청 동포경제인과 | 🔗 세계한인비즈니스대회 포털'
    },
    'urgent': {
      dept: '재외동포 365 민원콜센터 (24시간 상시 운영)',
      title: '365일 24시간 실시간 전화 및 카카오톡 긴급 상담',
      desc: '전 세계 어디서든 시차 걱정 없이 연중무휴로 민원 상담을 받을 수 있습니다. 5개 국어(한국어, 영어, 일본어, 중국어, 러시아어) 대응 및 카카오톡 무료 상담 채널이 제공됩니다.',
      contact: '📞 국내: 02-6747-0404 / 해외: +82-2-6747-0404 | 💬 카카오톡: 재외동포 365 민원콜센터'
    }
  };

  if (findBtn) {
    findBtn.addEventListener('click', () => {
      const need = needTypeSelect.value;
      const user = userTypeSelect.options[userTypeSelect.selectedIndex].text;
      const match = serviceDatabase[need];

      if (match) {
        resultDept.textContent = `[${user}] 추천 창구: ${match.dept}`;
        resultTitle.textContent = match.title;
        resultDesc.textContent = match.desc;
        resultContact.innerHTML = `<strong>문의 및 이용:</strong> ${match.contact}`;
        resultContainer.style.display = 'block';

        // 부드럽게 스크롤
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* 5. 국민 체감 맞춤 지원 자가진단 & 체크리스트 시스템 */
  const checkerTabs = document.querySelectorAll('#checkerTabs .tab-btn');
  const groupContents = document.querySelectorAll('.check-group-content');
  const btnRunCheck = document.getElementById('btnRunCheck');
  const btnResetCheck = document.getElementById('btnResetCheck');
  const checkResultBox = document.getElementById('checkResultBox');
  const resultCardsList = document.getElementById('resultCardsList');
  const resultSummaryTitle = document.getElementById('resultSummaryTitle');
  const resultSummaryDesc = document.getElementById('resultSummaryDesc');

  // 체크박스 클릭 시 시각적 클래스 toggle
  const checkInputs = document.querySelectorAll('.check-item input[type="checkbox"]');
  checkInputs.forEach(input => {
    input.addEventListener('change', () => {
      const parentLabel = input.closest('.check-item');
      if (input.checked) {
        parentLabel.classList.add('selected');
      } else {
        parentLabel.classList.remove('selected');
      }
    });
  });

  // 탭 전환 이벤트
  if (checkerTabs) {
    checkerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        checkerTabs.forEach(t => t.classList.remove('active'));
        groupContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // 체크리스트 상세 진단 데이터베이스
  const diagnosticDB = {
    // 1. 국내 국민/기업/청년
    'biz_export': {
      category: '경제·수출 지원',
      dept: '동포경제인네트워크과 & 재외동포경제협력센터',
      title: '세계한인비즈니스대회(한상대회) 1:1 수출상담 및 현지 판로 지원',
      desc: '해외 거주 700만 동포 경제인(한상)들과 직접 연결되어 국내 우수 제품을 해외 시장에 수출하고 투자 유치를 받을 수 있습니다. 매년 열리는 대회에서 1:1 비즈니스 매칭 부스와 통역, 수출 계약 자문을 무료로 지원받을 수 있습니다.',
      benefit: '해외 바이어 발굴 비용 절감, 계약 법률 지원, 해외 한인 유통망 진출',
      contact: '📞 032-585-3200 (재외동포청 경제인과)'
    },
    'youth_job': {
      category: '청년·일자리 지원',
      dept: '차세대동포과 (글로벌 한인 취업 연계)',
      title: '재외동포 기업 연계 청년 글로벌 인턴십 & 해외 취업 지원',
      desc: '국내 역량 있는 대학생 및 미취업 청년들이 미주, 유럽, 아시아 등 글로벌 한인 기업에서 6개월~1년간 실무 경험을 쌓고 정규직으로 전환될 수 있도록 항공료, 체재비, 사전 역량 교육을 지원합니다.',
      benefit: '인턴 체재 보조금 지원, 비자 발급 수속 지원, 현지 동포 멘토링 결연',
      contact: '🌐 재외동포포털(oka.go.kr) 내 청년인턴십 공모 참조'
    },
    'korea_book': {
      category: '공공외교·콘텐츠',
      dept: '재외동포정책총괄과 & 정체성함양팀',
      title: '‘한국의 발전상’ 해외 교과서 수록 프로젝트 및 시민 서포터즈',
      desc: '세계 최빈국에서 민주화와 경제성장을 동시에 이룬 대한민국의 발전 역사를 전 세계 교과서에 수록하는 국가 전략 사업입니다. 국내외 연구자 학술 포럼 지원 및 청년 민간 공공외교 활동 지원금을 제공합니다.',
      benefit: '학술 연구비 및 교재 개발 지원, 민간 외교관 활동 증명서 발급',
      contact: '📞 032-585-3100 (정책총괄과)'
    },
    'apostille_kor': {
      category: '원스톱 민원',
      dept: '재외동포서비스지원센터 (서울 광화문 통합민원실)',
      title: '외교부·법무부 문서 아포스티유(Apostille) 및 영사확인 원스톱 발급',
      desc: '유학, 해외 취업, 해외 이민 준비 시 필요한 졸업증명서, 가족관계서류, 경력증명서 등을 외교부와 법무부 방문 없이 광화문 센터에서 즉시 아포스티유 인증 및 번역공증 서류를 처리할 수 있습니다.',
      benefit: '여러 관공서 방문 없이 1개 창구에서 즉시 접수 및 발급',
      contact: '📍 서울 종로구 율곡로 6 트윈트리타워 A동 15층 (02-6747-0404)'
    },

    // 2. 해외 재외국민
    'call_365': {
      category: '24시간 민원 지원',
      dept: '재외동포 365 민원콜센터',
      title: '365일 24시간 연중무휴 시차 없는 다국어 민원 콜상담',
      desc: '해외 현지 시간 밤낮에 상관없이 국내 공공기관 업무(여권, 비자, 국적, 주민등록, 세금, 병역)를 5개 언어(한국어, 영어, 일본어, 중국어, 러시아어)로 실시간 전화 및 카카오톡 상담을 받을 수 있습니다.',
      benefit: '해외 어디서나 카카오톡 데이터 통화 무료, 야간/주말 즉시 답변',
      contact: '📞 +82-2-6747-0404 (해외 무료 카톡 채널: 재외동포 365 민원콜센터)'
    },
    'vote_rights': {
      category: '국민 권익·참정권',
      dept: '재외동포권익과 & 중앙선관위 재외선거관',
      title: '재외국민 참정권 보장 및 재외선거 편의 지원 (우편투표 등)',
      desc: '국외 체류 대한민국 국민이 소중한 주권을 행사할 수 있도록 재외선거인 등록 안내, 공관 투표소 편의 시설 확충을 지원하며, 원거리 거주자를 위한 우편투표·전자투표 법 개정을 적극 추진하고 있습니다.',
      benefit: '온라인 간편 국외부재자 신고 안내, 선거 공보물 원격 열람',
      contact: '🌐 nec.go.kr (중앙선거관리위원회 재외선거 시스템 연계)'
    },
    'military_tax': {
      category: '병무·세무 원스톱',
      dept: '서비스지원센터 국세청·병무청·국민연금 합동 상담반',
      title: '국외여행허가·병역 이행 및 국내 세금·국민연금 반환일시금 전문 상담',
      desc: '해외 영주권 취득자의 국외여행허가 연장 및 영주권자 입영희망원 제도, 해외 거주 중 국내 양도소득세/상속세 신고, 해외 이주 시 국민연금 반환일시금 지급 청구를 원스톱으로 처리합니다.',
      benefit: '병역 불이행 처벌 방지 사전 안내, 국세청 세무조사 예방 가이드',
      contact: '📞 02-6747-0404 (내선 세무/병무 전문상담관 연결)'
    },
    'next_gen': {
      category: '차세대 교육 육성',
      dept: '차세대동포과 & 교육문화팀',
      title: '전 세계 한글학교 운영비 지원 및 차세대 모국 방문 연수 장학',
      desc: '해외에서 자라는 2~3세 동포 자녀들이 한글과 한국 문화를 배울 수 있도록 현지 한글학교 교사 처우 개선 및 교재를 무상 제공하며, 매년 여름 국내로 초청하는 역사문화 캠프 장학생을 선발합니다.',
      benefit: '캠프 항공료 및 숙식 전액/일부 장학 지원, 한국어 맞춤형 온라인 콘텐츠 제공',
      contact: '🌐 study.korean.net (스터디코리안 포털)'
    },

    // 3. 외국 국적 동포
    'f4_visa': {
      category: '출입국·체류 지원',
      dept: '법무부 출입국 파견센터 & 재외동포청 거주지원팀',
      title: '재외동포 체류자격(F-4 사증) 발급 및 국내 취업·거소 원스톱 처리',
      desc: '외국 국적을 취득한 동포가 한국에 장기 체류하거나 자유롭게 경제 활동을 할 수 있도록 F-4 비자 발급 및 국내거소신고증(외국국적동포 국내 신분증) 발급 심사를 원스톱으로 지원합니다.',
      benefit: '단순노무 제외 폭넓은 취업 허용, 국내 건강보험·금융거래 내국인 수준 보장',
      contact: '📍 서울 광화문 트윈트리타워 15층 재외동포서비스지원센터'
    },
    'nat_recovery': {
      category: '국적 법률 상담',
      dept: '법무부 국적과 파견관 & 재외동포 인권법률자문단',
      title: '만 65세 이상 동포 복수국적 취득 및 국적회복 허가 안내',
      desc: '외국 국적을 보유한 만 65세 이상 재외동포가 한국 영주 귀국 시 외국국적 불행사 서약을 통해 복수국적을 취득하는 절차와 서류 준비를 1:1로 사전 검토해 드립니다.',
      benefit: '내국인 주민등록증 발급 복원, 기초연금·노인복지 혜택 동등 수혜',
      contact: '📞 02-6747-0404 (국적 전담 상담창구)'
    },
    'family_reg': {
      category: '가족관계·행정',
      dept: '법원행정처 파견관 & 대법원 전산망 창구',
      title: '재외동포 가족관계등록부 정리, 혼인·출생 증명 신속 발급',
      desc: '해외에서 출생하거나 사망한 동포의 호적 정리, 상속을 위한 제적등본 및 가족관계증명서 발급, 성명 정정 등 복잡한 신분 관계 등록을 해외 공관을 거치지 않고 직접 신속 처리합니다.',
      benefit: '수개월 걸리던 해외 공관 우편 처리 기간을 1~2일 내로 대폭 단축',
      contact: '📍 서울 광화문 통합민원실 가족관계 창구'
    },
    'heritage_culture': {
      category: '문화·민간 교류',
      dept: '동포사회연대과 & 문화홍보팀',
      title: '재외동포 문학상 공모, 문화예술 활동 지원금 및 한인회 행사 보조',
      desc: '전 세계 한인 예술가와 문학인들의 창작 활동을 응원하는 ‘재외동포 문학상(상금 및 수필·시 공모)’을 운영하며, 해외 한인회·문화단체의 3.1절·광복절 등 전통 문화 행사 개최비를 심사 지원합니다.',
      benefit: '우수 작품 창작지원금 수여, 공모 사업 보조금 최대 수천만원 지원',
      contact: '🌐 oka.go.kr 지원사업 수요조사 공고 참조'
    },

    // 4. 국내 체류/귀환 동포
    'sakhalin_settle': {
      category: '역사적 동포 예우',
      dept: '사할린동포지원팀 (보건복지부·LH 협업)',
      title: '사할린동포 영주귀국 및 보금자리 주거·생계 안정 맞춤 지원',
      desc: '일제강점기 사할린으로 강제동원되었던 동포와 그 배우자 및 직계비속 1인을 모국으로 모셔와 임대주택 배정, 영주귀국 정착지원금, 의료급여 혜택 등을 법률에 따라 평생 예우합니다.',
      benefit: '영주귀국 정착금 지원, LH 국민임대주택 알선, 전담 의료 코디네이터',
      contact: '📞 032-585-3250 (사할린동포 전담팀)'
    },
    'koryoin_edu': {
      category: '국내 정착·교육',
      dept: '국내체류동포지원팀 & 거점센터',
      title: '고려인 동포 한국어 교육, 자녀 학교 적응 및 취업 연계 코칭',
      desc: '러시아·중앙아시아 등에서 모국으로 귀환하여 거주 중인 고려인 동포와 그 자녀들의 언어 장벽을 해소하기 위해 안산, 광주 등 집거지 거점 한글교실과 취업 맞춤 직무 교육을 무료 제공합니다.',
      benefit: '무료 한국어 교재 및 수업, 자녀 방과후 학습 돌봄, 지역 일자리 알선',
      contact: '🌐 국내 고려인 거점 지원센터 및 재외동포청 포털'
    },
    'adoptee_root': {
      category: '입양동포 포용',
      dept: '해외입양동포지원팀 & 아동권리보장원 협업',
      title: '해외입양동포 친부모·뿌리찾기 DNA 검사 및 모국 방문 전폭 지원',
      desc: '어린 시절 해외로 입양된 동포들이 정체성을 찾고 친부모와 상봉할 수 있도록 경찰청·아동권리보장원과 연계하여 유전자(DNA) 등록 및 입양기록 조회를 지원하며, 모국 연수 항공료를 지원합니다.',
      benefit: '무료 유전자 검사 및 상봉 주선, 전문 통역 및 심리상담 바우처 제공',
      contact: '📞 02-6747-0404 (입양동포 전담상담)'
    },
    'airport_support': {
      category: '공항 현장 민원',
      dept: '인천국제공항 재외동포 통합서비스데스크',
      title: '인천공항 제1·2터미널 현장 긴급 체류/출입국 원스톱 안내',
      desc: '모국에 입국하는 동포들이 공항 도착 즉시 체류 자격 확인, 긴급 민원 서류 발급 안내, 외국인등록 사전 예약 안내 등을 대면으로 친절하게 도움받을 수 있는 공항 전용 데스크입니다.',
      benefit: '비행기에서 내리자마자 바로 상담, 교통 및 행정 절차 현장 브리핑',
      contact: '📍 인천국제공항 제1터미널 및 제2터미널 정부종합행정센터 내'
    }
  };

  // 진단 실행 버튼 클릭
  if (btnRunCheck) {
    btnRunCheck.addEventListener('click', () => {
      const checkedBoxes = document.querySelectorAll('.checklist-grid input[type="checkbox"]:checked');
      
      if (checkedBoxes.length === 0) {
        alert('한 가지 이상의 항목에 체크해 주세요. 나의 상황에 맞는 맞춤 지원 혜택을 찾아드립니다!');
        return;
      }

      // 결과 비우기
      resultCardsList.innerHTML = '';
      let matchedCount = 0;

      checkedBoxes.forEach(chk => {
        const itemData = diagnosticDB[chk.value];
        if (itemData) {
          matchedCount++;
          const cardEl = document.createElement('div');
          cardEl.className = 'matched-item-card';
          cardEl.innerHTML = `
            <span class="matched-dept">${itemData.category} | 담당: ${itemData.dept}</span>
            <h4 class="matched-title">✨ ${itemData.title}</h4>
            <p class="matched-desc">${itemData.desc}</p>
            <div class="matched-detail-box">
              <span>🎁 <strong>핵심 혜택:</strong> ${itemData.benefit}</span>
              <span>📞 <strong>문의/이용:</strong> ${itemData.contact}</span>
            </div>
          `;
          resultCardsList.appendChild(cardEl);
        }
      });

      resultSummaryTitle.textContent = `축하합니다! 선택하신 조건에 맞는 정부 지원 ${matchedCount}건이 확인되었습니다.`;
      resultSummaryDesc.textContent = `재외동포청과 산하 서비스지원센터를 통해 아래의 행정·경제·법률·교육 지원을 즉시 신청하고 도움받으실 수 있습니다.`;

      checkResultBox.style.display = 'block';
      checkResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 전체 초기화 버튼
  if (btnResetCheck) {
    btnResetCheck.addEventListener('click', () => {
      checkInputs.forEach(input => {
        input.checked = false;
        input.closest('.check-item')?.classList.remove('selected');
      });
      checkResultBox.style.display = 'none';
      resultCardsList.innerHTML = '';
    });
  }

});

