import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('');
  console.error('Required environment variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('To get your service role key:');
  console.error('1. Go to Supabase Dashboard → Settings → API');
  console.error('2. Copy the "service_role" key (NOT the anon key)');
  console.error('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.error('');
  console.error('⚠️  WARNING: Keep the service_role key secret! Never commit it to git.');
  process.exit(1);
}

// Use service role key to bypass RLS policies
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// System user ID for seeding
const SEED_USER_ID: string = '00000000-0000-0000-0000-000000000001'; // System user

/**
 * Ensure system user exists
 */
async function ensureSystemUser() {
  console.log('👤 Checking for system user...');

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', SEED_USER_ID)
    .single();

  if (existingUser) {
    console.log('✅ System user already exists\n');
    return;
  }

  console.log('Creating system user...');
  const { error } = await supabase
    .from('users')
    .insert({
      id: SEED_USER_ID,
      email: 'system@ocp-app.com',
    });

  if (error) {
    console.error('❌ Error creating system user:', error.message);
    throw error;
  }

  console.log('✅ System user created\n');
}

// Seed data: Korean language threads about car importing
const seedData = [
  {
    thread: {
      title: "미국에서 차량 수입 시 배송 방법 추천 부탁드려요",
      replies: [
        {
          body: "저는 RoRo 방식으로 LA에서 인천까지 보냈는데 약 200만원 정도 들었어요. 3주 걸렸고 차량 상태는 괜찮았습니다. 다만 외부 노출되는 거라 비싼 차는 컨테이너 추천드려요."
        },
        {
          body: "컨테이너 배송이 안전하긴 한데 비용이 거의 2배예요. 저는 5천만원 이상 차량이면 컨테이너, 그 이하는 RoRo로 결정하시면 될 것 같아요. 보험은 꼭 가입하세요!"
        },
        {
          body: "해상 보험 필수입니다. 차량 가격의 1.5% 정도인데 제 지인은 배송 중 손상되어 보험으로 다 해결했다고 하더라고요."
        }
      ]
    }
  },
  {
    thread: {
      title: "통관 절차 얼마나 걸렸나요? 경험 공유해주세요",
      replies: [
        {
          body: "인천항에서 이틀 만에 통관됐어요. 통관 대행 업체 써서 서류 다 맡겼더니 편했습니다. 대행 수수료는 50만원 정도였어요."
        },
        {
          body: "저는 서류 하나 빠져서 일주일 걸렸습니다ㅠㅠ 미국 수출 증명서 없어서 재발급 받느라 시간 걸렸어요. 서류 꼭 다시 한 번 체크하세요!"
        },
        {
          body: "팁: 배가 오는 동안 미리 통관 대행업체랑 연락해서 서류 검토 받으세요. 도착하자마자 바로 통관 들어가면 3-4일 절약됩니다."
        },
        {
          body: "항구 보관료가 하루에 5만원씩 나가요. 통관 지연되면 보관료 폭탄 맞으니 서류는 완벽하게 준비하세요!"
        }
      ]
    }
  },
  {
    thread: {
      title: "배기량 2000cc vs 1999cc 세금 차이 얼마나 나나요?",
      replies: [
        {
          body: "제가 계산해봤는데 2001cc랑 1999cc가 특소세율이 같아서 큰 차이는 없어요. 다만 1600cc 구간이 중요한데, 1599cc vs 1601cc는 세금 100만원 이상 차이 납니다."
        },
        {
          body: "구간 경계값 조심하세요. 1600cc, 2000cc가 중요한 기준선이에요. 가능하면 살짝 아래 모델 찾는 게 세금 절약하는 방법입니다."
        },
        {
          body: "계산기 써보세요! 제가 3천만원 차량 기준으로 1600cc랑 1700cc 비교했더니 세금 차이가 150만원 정도 나더라고요."
        }
      ]
    }
  },
  {
    thread: {
      title: "Carfax 리포트 꼭 사야 하나요? 비용이 아까워서...",
      replies: [
        {
          body: "무조건 사세요. 저는 Carfax 안 보고 샀다가 사고 이력 있는 차 받았습니다. 40달러 아끼려다 수백만원 날렸어요ㅠㅠ"
        },
        {
          body: "Carfax나 AutoCheck 둘 중 하나는 필수예요. 주행거리 조작, 침수 이력, 사고 여부 다 나와요. 특히 Salvage Title은 한국 등록 자체가 어려울 수 있어서 꼭 확인하셔야 합니다."
        },
        {
          body: "미국 경매 사이트에서 사시면 현지 검수 대행도 같이 쓰세요. $300 정도인데 숨은 결함 찾아줘요."
        }
      ]
    }
  },
  {
    thread: {
      title: "교통안전공단 검사 경험담 - 어떤 것들 체크하나요?",
      replies: [
        {
          body: "25년 이상 차량은 고전차 예외승인 신청하면 검사가 많이 완화돼요. 저는 1995년식 차로 신청했더니 배출가스 면제받았습니다."
        },
        {
          body: "화성 검사장 다녀왔는데 헤드라이트 각도, 브레이크, 안전벨트 위주로 봤어요. 불법 튜닝 부품 있으면 교체해야 하니 미리 준비하세요."
        },
        {
          body: "검사 전에 수입차 전문 정비소 먼저 가세요. 어떤 부분 고쳐야 할지 미리 알려줘서 검사장 가서 바로 통과했어요. 비용도 30만원 정도 절약했습니다."
        },
        {
          body: "틴팅 진하면 떼야 해요. 가시광선 투과율 70% 이상이어야 합니다. 저는 틴팅 다 제거하고 검사 받았어요."
        }
      ]
    }
  },
  {
    thread: {
      title: "FTA 관세 혜택 받으려면 어떻게 해야 하나요?",
      replies: [
        {
          body: "미국, EU, 캐나다에서 수입하시면 원산지 증명서 받으세요. 관세가 8%에서 0%로 떨어지니까 3천만원 차량 기준으로 200만원 이상 절약됩니다."
        },
        {
          body: "통관 대행업체한테 FTA 적용 가능한지 미리 물어보세요. 원산지 증명서 양식이 나라마다 다르고, 서류 하나만 빠져도 일반 관세 내야 해요."
        },
        {
          body: "주의할 점: 차량이 미국 '제조'여야 FTA 혜택 받아요. 미국에서 팔았어도 독일에서 만들었으면 FTA 안 되는 경우도 있으니 확인 필수!"
        }
      ]
    }
  },
  {
    thread: {
      title: "총 비용이 예상보다 훨씬 많이 나왔어요... 주의하세요",
      replies: [
        {
          body: "차량 구매가 + 세금만 생각했다가 큰일 날 뻔했어요. 배송비, 보험, 항구 수수료, 통관 대행비, 검사비, 내륙 운송비까지 하니까 예상의 1.5배 나왔습니다."
        },
        {
          body: "숨은 비용 정리:\n- 항구 보관료 (하루 5만원)\n- 내륙 운송비 (부산→서울 30만원)\n- 번호판 제작비\n- 취득세/등록세\n- 임시 운행 허가증\n\n이것들 다 합치면 200-300만원 추가예요."
        },
        {
          body: "계산기 쓰셔도 실제 비용의 10% 정도는 여유 예산 잡으세요. 예상치 못한 비용이 항상 나와요."
        }
      ]
    }
  },
  {
    thread: {
      title: "환율 때문에 고민입니다. 언제 송금하는 게 좋을까요?",
      replies: [
        {
          body: "저는 환율 1,300원대일 때 미리 달러 사놨어요. 계약할 때는 1,400원까지 올라서 300만원 절약했습니다. 환율 변동 예측은 어렵지만 여유 있으면 미리 사두는 게 좋아요."
        },
        {
          body: "환전 수수료도 무시 못 해요. 은행마다 다르니 비교하세요. 저는 Wise 쓰니까 은행보다 50만원 정도 저렴했어요."
        },
        {
          body: "대량 송금이면 은행 가서 우대환율 협상하세요. 1억 이상이면 기준 환율보다 낮게 받을 수 있어요."
        }
      ]
    }
  }
];

async function seedThreads() {
  console.log('🌱 Starting community seeding process...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Ensure system user exists
    await ensureSystemUser();

    const userId = SEED_USER_ID;
    console.log(`✅ Using system user ID: ${userId}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📋 Threads to seed: ${seedData.length}`);
    console.log('');

    let threadsCreated = 0;
    let threadsSkipped = 0;
    let repliesCreated = 0;

    // Create threads and replies
    for (const item of seedData) {
      console.log(`📝 Processing: "${item.thread.title}"`);

      // Check if thread already exists
      const { data: existing } = await supabase
        .from('threads')
        .select('id')
        .eq('title', item.thread.title)
        .single();

      if (existing) {
        console.log(`   ⚠️  Thread already exists, skipping...\n`);
        threadsSkipped++;
        continue;
      }

      // Create thread
      const { data: threadData, error: threadError } = await supabase
        .from('threads')
        .insert([
          {
            title: item.thread.title,
            author_id: userId,
          }
        ])
        .select()
        .single();

      if (threadError) {
        console.error(`   ❌ Error creating thread:`, threadError.message);
        console.log('');
        continue;
      }

      console.log(`   ✅ Thread created with ID: ${threadData.id}`);
      threadsCreated++;

      // Create replies for this thread
      if (item.thread.replies && item.thread.replies.length > 0) {
        console.log(`   💬 Adding ${item.thread.replies.length} replies...`);

        for (const reply of item.thread.replies) {
          const { error: replyError } = await supabase
            .from('comments')
            .insert([
              {
                thread_id: threadData.id,
                author_id: userId,
                body: reply.body,
              }
            ]);

          if (replyError) {
            console.error(`      ❌ Error creating reply:`, replyError.message);
          } else {
            console.log(`      ✅ Reply added`);
            repliesCreated++;
          }
        }
      }

      console.log('');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Seeding Summary:');
    console.log(`   ✅ Threads created: ${threadsCreated}`);
    console.log(`   ⏭️  Threads skipped: ${threadsSkipped}`);
    console.log(`   💬 Replies created: ${repliesCreated}`);
    console.log(`   📚 Total: ${seedData.length} threads\n`);

    console.log('🎉 Community seeding complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit /ko/community to see the discussions');
    console.log('   2. Check Supabase Dashboard → Table Editor → threads');
    console.log('   3. Test creating your own thread as a logged-in user\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedThreads()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
