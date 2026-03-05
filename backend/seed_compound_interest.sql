-- ============================================================
-- SEED DATA: Compound Interest Micro-Learning Module
-- Pedestal – Duolingo-style Financial Education
-- ============================================================

-- 1. CREATE THE TRACK
-- ============================================================
INSERT INTO tracks (id, title, description, category, difficulty, order_index, is_active, icon_url)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Compound Interest Mastery',
    'Master the most powerful force in finance. Learn how compound interest builds wealth through flashcards, quizzes, and real-world scenarios.',
    'investing',
    1,
    1,
    TRUE,
    '🌱'
);

-- ============================================================
-- 2. LESSONS (9 total — 3 per section)
-- ============================================================

-- ── SECTION 1: 🌱 The Seed ──────────────────────────────────

INSERT INTO lessons (id, track_id, title, description, difficulty_level, energy_cost, xp_reward, order_index, has_video, estimated_duration_seconds, is_active)
VALUES
(
    '11111111-1111-1111-1111-111111111101',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'What is Compound Interest?',
    '🌱 Section 1 — The Seed | Learn the basic definition and why it matters.',
    1, 1, 25, 1, FALSE, 120, TRUE
),
(
    '11111111-1111-1111-1111-111111111102',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Simple vs Compound Interest',
    '🌱 Section 1 — The Seed | Understand the key difference that changes everything.',
    1, 1, 25, 2, FALSE, 120, TRUE
),
(
    '11111111-1111-1111-1111-111111111103',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'The Magic Formula',
    '🌱 Section 1 — The Seed | Master A = P(1 + r)^t and what each variable means.',
    1, 1, 30, 3, FALSE, 150, TRUE
),

-- ── SECTION 2: 📈 Growth ────────────────────────────────────

(
    '11111111-1111-1111-1111-111111111201',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Rule of 72',
    '📈 Section 2 — Growth | The quick trick to estimate doubling time.',
    2, 1, 30, 4, FALSE, 120, TRUE
),
(
    '11111111-1111-1111-1111-111111111202',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Power of Time',
    '📈 Section 2 — Growth | Why starting early is a financial superpower.',
    2, 1, 35, 5, FALSE, 150, TRUE
),
(
    '11111111-1111-1111-1111-111111111203',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Compounding Frequency',
    '📈 Section 2 — Growth | Monthly vs yearly — does frequency matter?',
    2, 1, 35, 6, FALSE, 150, TRUE
),

-- ── SECTION 3: 🚀 Wealth Engine ─────────────────────────────

(
    '11111111-1111-1111-1111-111111111301',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Real Estate & Compounding',
    '🚀 Section 3 — Wealth Engine | How compounding drives property value.',
    3, 1, 40, 7, FALSE, 180, TRUE
),
(
    '11111111-1111-1111-1111-111111111302',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Loans & the Dark Side',
    '🚀 Section 3 — Wealth Engine | When compounding works against you.',
    3, 1, 40, 8, FALSE, 180, TRUE
),
(
    '11111111-1111-1111-1111-111111111303',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Investing Early vs Late',
    '🚀 Section 3 — Wealth Engine | The ultimate proof that time beats money.',
    3, 1, 50, 9, FALSE, 180, TRUE
);


-- ============================================================
-- 3. LESSON BLOCKS (Flashcards + Quizzes per lesson)
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- LESSON 1: What is Compound Interest?
-- ════════════════════════════════════════════════════════════

-- Flashcard Block
INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111101', 'flashcard', 1, '{
    "cards": [
        {
            "front": "What is Compound Interest?",
            "back": "Interest calculated on the initial principal PLUS all previously accumulated interest. Your money earns money on its money! 💰"
        },
        {
            "front": "Why is compound interest called the 8th wonder of the world?",
            "back": "Because it creates exponential growth — small amounts turn into massive wealth over time. Einstein reportedly called it the most powerful force in the universe."
        },
        {
            "front": "What is the principal?",
            "back": "The original amount of money you invest or borrow before any interest is applied."
        }
    ]
}');

-- Quiz Block
INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111101', 'quiz', 2, '{
    "questions": [
        {
            "q": "What does compound interest calculate interest on?",
            "options": ["Only the original principal", "Principal + accumulated interest", "Only the accumulated interest", "A fixed monthly amount"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Compound interest is special because it calculates interest on BOTH the original principal AND previously earned interest. This creates a snowball effect."
        },
        {
            "q": "Who famously called compound interest the 8th wonder of the world?",
            "options": ["Warren Buffett", "Elon Musk", "Albert Einstein", "Bill Gates"],
            "correct": 2,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Albert Einstein is widely attributed this quote, highlighting the extraordinary power of compounding over time."
        },
        {
            "q": "If you invest ₹1,000 at 10% compound interest, how much interest do you earn in year 2?",
            "options": ["₹100", "₹110", "₹200", "₹121"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Year 1: ₹1,000 × 10% = ₹100 interest (total ₹1,100). Year 2: ₹1,100 × 10% = ₹110 interest. You earn ₹10 more than year 1 because of compounding!"
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 2: Simple vs Compound Interest
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111102', 'flashcard', 1, '{
    "cards": [
        {
            "front": "Simple Interest vs Compound Interest",
            "back": "Simple interest applies only to the original principal. Compound interest grows on BOTH the principal AND previously earned interest. Over time, compound interest dramatically outperforms."
        },
        {
            "front": "Simple Interest Formula",
            "back": "SI = P × r × t\nWhere P = Principal, r = rate, t = time in years.\nExample: ₹10,000 at 10% for 3 years = ₹3,000 interest."
        },
        {
            "front": "₹10,000 invested for 10 years at 10% — Simple vs Compound",
            "back": "Simple: ₹10,000 + ₹10,000 = ₹20,000\nCompound: ₹10,000 × (1.10)^10 = ₹25,937\n\nCompound earns ₹5,937 MORE! 🚀"
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111102', 'quiz', 2, '{
    "questions": [
        {
            "q": "Which type of interest only applies to the original principal amount?",
            "options": ["Compound interest", "Simple interest", "Variable interest", "Floating interest"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Simple interest is calculated only on the original principal, ignoring any previously earned interest."
        },
        {
            "q": "₹10,000 at 10% simple interest for 5 years gives you:",
            "options": ["₹15,000", "₹16,105", "₹12,000", "₹15,500"],
            "correct": 0,
            "xp": 10,
            "difficulty": "medium",
            "explanation": "SI = ₹10,000 × 0.10 × 5 = ₹5,000. Total = ₹10,000 + ₹5,000 = ₹15,000."
        },
        {
            "q": "After 20 years, which will give you MORE money?",
            "options": ["Simple interest at 12%", "Compound interest at 10%", "Both give the same", "Depends on the bank"],
            "correct": 1,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Even at a lower rate, compound interest usually beats simple interest over long periods because of the exponential growth effect."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 3: The Magic Formula
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111103', 'flashcard', 1, '{
    "cards": [
        {
            "front": "Compound Interest Formula",
            "back": "A = P(1 + r)^t\n\nA = Final amount\nP = Principal (initial investment)\nr = Annual interest rate (as decimal)\nt = Time in years"
        },
        {
            "front": "Break down: ₹5,000 at 8% for 10 years",
            "back": "A = 5000 × (1 + 0.08)^10\nA = 5000 × (1.08)^10\nA = 5000 × 2.159\nA = ₹10,794.62\n\nYour money more than DOUBLED! 💪"
        },
        {
            "front": "What does (1 + r)^t represent?",
            "back": "The growth multiplier. It tells you how many times your original investment will multiply over t years at rate r. The higher r or t, the bigger the multiplier."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111103', 'quiz', 2, '{
    "questions": [
        {
            "q": "In A = P(1 + r)^t, what does ''P'' stand for?",
            "options": ["Profit", "Percentage", "Principal", "Payment"],
            "correct": 2,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "P stands for Principal — the original amount of money invested or borrowed."
        },
        {
            "q": "₹1,000 at 10% compound interest for 3 years. What is the final amount?",
            "options": ["₹1,300", "₹1,331", "₹1,310", "₹1,210"],
            "correct": 1,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "A = 1000 × (1.10)^3 = 1000 × 1.331 = ₹1,331."
        },
        {
            "q": "Which variable has the MOST impact on compound interest growth?",
            "options": ["Principal (P)", "Interest rate (r)", "Time (t)", "All are equal"],
            "correct": 2,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Time (t) has the greatest impact because it''s in the exponent. Doubling your time has a much bigger effect than doubling your principal."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 4: Rule of 72
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111201', 'flashcard', 1, '{
    "cards": [
        {
            "front": "What is the Rule of 72?",
            "back": "A quick mental shortcut:\nYears to double your money ≈ 72 ÷ interest rate\n\nAt 8% → 72 ÷ 8 = 9 years to double\nAt 12% → 72 ÷ 12 = 6 years to double"
        },
        {
            "front": "Rule of 72: How long to double ₹1 lakh at 6%?",
            "back": "72 ÷ 6 = 12 years\n\nYour ₹1,00,000 becomes ₹2,00,000 in about 12 years without adding a single rupee."
        },
        {
            "front": "Rule of 72 in reverse: What rate doubles money in 4 years?",
            "back": "Rate = 72 ÷ 4 = 18% per year\n\nYou''d need an 18% annual return to double in 4 years. That''s aggressive! 🔥"
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111201', 'quiz', 2, '{
    "questions": [
        {
            "q": "Using the Rule of 72, how long does it take to double your money at 9% interest?",
            "options": ["6 years", "8 years", "9 years", "12 years"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "72 ÷ 9 = 8 years. Your money doubles in approximately 8 years at 9% interest."
        },
        {
            "q": "What interest rate do you need to double your money in 6 years?",
            "options": ["6%", "10%", "12%", "15%"],
            "correct": 2,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Rate = 72 ÷ 6 = 12%. You need a 12% annual return to double money in 6 years."
        },
        {
            "q": "At 24% return, your money doubles in approximately:",
            "options": ["2 years", "3 years", "4 years", "6 years"],
            "correct": 1,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "72 ÷ 24 = 3 years. High returns lead to very fast doubling, but such returns are rare and risky."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 5: Power of Time
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111202', 'flashcard', 1, '{
    "cards": [
        {
            "front": "Why is starting early so powerful?",
            "back": "Because compound interest is exponential. The first 10 years might only double your money, but the NEXT 10 years quadruple it. Time is the secret weapon."
        },
        {
            "front": "₹10,000 at 12% — 10 years vs 20 years vs 30 years",
            "back": "10 years: ₹31,058\n20 years: ₹96,463\n30 years: ₹2,99,599\n\nNotice: The last 10 years added MORE than the first 20 combined! 🤯"
        },
        {
            "front": "The Waiting Tax",
            "back": "Every year you delay investing costs you exponentially more. Waiting 5 years to start could cost you 30-50% of your final wealth. Start NOW, even with small amounts."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111202', 'quiz', 2, '{
    "questions": [
        {
            "q": "You invest ₹10,000 at 12% annual compound interest for 5 years. What is the approximate final amount?",
            "options": ["₹15,000", "₹17,623", "₹18,000", "₹20,000"],
            "correct": 1,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "A = 10,000 × (1.12)^5 = 10,000 × 1.7623 = ₹17,623. This is a classic compound interest calculation."
        },
        {
            "q": "Person A invests ₹5,000/yr from age 20-30 (10 years). Person B invests ₹5,000/yr from age 30-40 (10 years). At 10% returns, who has more at age 60?",
            "options": ["Person B (started later, same amount)", "Both have the same", "Person A (started earlier)", "Cannot be determined"],
            "correct": 2,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "Person A wins by a HUGE margin! Even though both invested the same total, Person A''s money had 10 extra years to compound. Time > Amount."
        },
        {
            "q": "If you double the time period, the interest earned:",
            "options": ["Exactly doubles", "More than doubles", "Less than doubles", "Stays the same"],
            "correct": 1,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Because compounding is exponential, doubling the time MORE than doubles your interest. This is the magic of the exponent in the formula."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 6: Compounding Frequency
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111203', 'flashcard', 1, '{
    "cards": [
        {
            "front": "Does compounding frequency matter?",
            "back": "YES! The more frequently interest is compounded, the more you earn.\n\nAnnual < Semi-annual < Quarterly < Monthly < Daily\n\nMore frequent = more micro-compounding events."
        },
        {
            "front": "₹10,000 at 12% for 5 years — Annual vs Monthly compounding",
            "back": "Annual: ₹17,623\nMonthly: ₹18,167\n\nMonthly compounding earns ₹544 MORE — just by compounding more often! 📊"
        },
        {
            "front": "What is APY (Annual Percentage Yield)?",
            "back": "APY shows the REAL return after accounting for compounding frequency. A 12% rate compounded monthly has an APY of 12.68%. Always compare APY, not just the stated rate."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111203', 'quiz', 2, '{
    "questions": [
        {
            "q": "Which compounding frequency gives the HIGHEST return?",
            "options": ["Annually", "Quarterly", "Monthly", "Daily"],
            "correct": 3,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Daily compounding gives the highest returns because interest is calculated and added most frequently."
        },
        {
            "q": "Bank A offers 10% compounded annually. Bank B offers 9.8% compounded monthly. Which is better for a 5-year deposit?",
            "options": ["Bank A (higher rate)", "Bank B (higher frequency)", "Both are identical", "Need more information"],
            "correct": 1,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "Bank B APY = (1 + 0.098/12)^12 - 1 ≈ 10.25%. Bank A APY = 10%. Bank B is actually better despite the lower stated rate!"
        },
        {
            "q": "What does APY stand for?",
            "options": ["Annual Payment Yield", "Annual Percentage Yield", "Average Profit Yearly", "Actual Principal Yield"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "APY stands for Annual Percentage Yield — it reflects the true annual return accounting for compounding frequency."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 7: Real Estate & Compounding
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111301', 'flashcard', 1, '{
    "cards": [
        {
            "front": "How does compounding apply to real estate?",
            "back": "Property values appreciate over time like compound interest. If a ₹40 lakh property grows at 8% per year, it compounds on the growing value — not just the original price."
        },
        {
            "front": "₹40,00,000 property at 8% yearly for 5 years",
            "back": "A = 40,00,000 × (1.08)^5\nA = 40,00,000 × 1.469\nA = ₹58,77,312\n\nYour property gained nearly ₹19 lakhs without you doing anything! 🏠"
        },
        {
            "front": "Real estate leverage + compounding",
            "back": "If you buy a ₹50L property with ₹10L down payment and it appreciates 10%, you gain ₹5L on a ₹10L investment = 50% return! Leverage amplifies compounding."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111301', 'quiz', 2, '{
    "questions": [
        {
            "q": "You buy a house for ₹40,00,000 and property prices increase 8% per year. What is the approximate value after 5 years?",
            "options": ["₹48,00,000", "₹56,00,000", "₹58,77,312", "₹52,00,000"],
            "correct": 2,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "A = 40,00,000 × (1.08)^5 = 40,00,000 × 1.4693 = ₹58,77,312. Property appreciation compounds just like investments."
        },
        {
            "q": "Why is real estate considered a ''compound growth'' asset?",
            "options": ["Because you pay monthly rent", "Because property value grows on the increasing base", "Because banks give you loans", "Because property never loses value"],
            "correct": 1,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Property values compound because each year''s growth is on the CURRENT value (which includes previous years'' growth), not just the original purchase price."
        },
        {
            "q": "A ₹1 crore property appreciates at 7% for 10 years. Approximate value?",
            "options": ["₹1.70 crore", "₹1.97 crore", "₹2.10 crore", "₹1.50 crore"],
            "correct": 1,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "A = 1,00,00,000 × (1.07)^10 ≈ 1,96,71,514 ≈ ₹1.97 crore. The Rule of 72 tells us: 72/7 ≈ 10 years to double, so close to ₹2 crore."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 8: Loans & the Dark Side
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111302', 'flashcard', 1, '{
    "cards": [
        {
            "front": "When does compounding work AGAINST you?",
            "back": "When you BORROW money! Credit cards, personal loans, and delayed EMIs all use compound interest — but against YOU. The longer you delay, the more you owe."
        },
        {
            "front": "Credit card trap: 36% annual interest",
            "back": "₹50,000 credit card debt at 36% (3% monthly) compounded:\nAfter 1 year: ₹71,288\nAfter 2 years: ₹1,01,640\n\nYour ₹50K debt DOUBLED in 2 years! 😱"
        },
        {
            "front": "Car loan: ₹5,00,000 at 10% compounded yearly",
            "back": "If you delay repayment by just 2 years:\nOriginal: ₹5,00,000\nAfter delay: ₹6,05,000\n\nYou paid ₹1,05,000 EXTRA for waiting. Every delay costs more."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111302', 'quiz', 2, '{
    "questions": [
        {
            "q": "You take a car loan of ₹5,00,000 at 10% interest compounded yearly. What happens if you delay repayment by 2 years?",
            "options": ["You owe the same amount", "You owe ₹6,05,000", "You owe ₹5,50,000", "The bank forgives the extra"],
            "correct": 1,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "A = 5,00,000 × (1.10)^2 = 5,00,000 × 1.21 = ₹6,05,000. The extra ₹1,05,000 is the cost of delaying."
        },
        {
            "q": "A ₹1,00,000 credit card balance at 3% monthly compound interest becomes how much after 1 year?",
            "options": ["₹1,36,000", "₹1,42,576", "₹1,30,000", "₹1,12,000"],
            "correct": 1,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "A = 1,00,000 × (1.03)^12 = 1,00,000 × 1.4258 = ₹1,42,576. Credit card interest compounds monthly, making it extremely expensive!"
        },
        {
            "q": "Which strategy is BEST to minimize compound interest on debt?",
            "options": ["Pay minimum amount each month", "Pay as early and as much as possible", "Take another loan to cover it", "Ignore it and let it grow"],
            "correct": 1,
            "xp": 10,
            "difficulty": "easy",
            "explanation": "Paying early and paying more reduces the principal, which means less interest compounds. Every extra rupee you pay saves you exponentially more over time."
        }
    ]
}');


-- ════════════════════════════════════════════════════════════
-- LESSON 9: Investing Early vs Late
-- ════════════════════════════════════════════════════════════

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111303', 'flashcard', 1, '{
    "cards": [
        {
            "front": "The Early Bird Story 🐦",
            "back": "Priya starts investing ₹5,000/yr at age 20 and stops at 30.\nRaj starts investing ₹5,000/yr at age 30 and continues until 60.\n\nPriya invested ₹50,000. Raj invested ₹1,50,000.\nAt 10% returns by age 60:\nPriya: ₹9,06,265\nRaj: ₹8,22,470\n\nPriya wins with 1/3rd the investment! 🏆"
        },
        {
            "front": "The Cost of Waiting 5 Years",
            "back": "Starting at 25 vs 20 with ₹5,000/month at 12%:\nAge 20 start: ₹3.24 crore by age 55\nAge 25 start: ₹1.76 crore by age 55\n\nWaiting 5 years cost ₹1.48 CRORE! 😰"
        },
        {
            "front": "Your biggest investment asset",
            "back": "It is not money. It is not intelligence. It is TIME.\n\nStart early, stay consistent, let compound interest do the heavy lifting. Even ₹500/month from age 20 beats ₹5,000/month from age 35."
        }
    ]
}');

INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content) VALUES
('11111111-1111-1111-1111-111111111303', 'quiz', 2, '{
    "questions": [
        {
            "q": "Aman invests ₹5,000/yr from age 20 to 30 (total ₹50,000). Priya invests ₹5,000/yr from age 30 to 60 (total ₹1,50,000). At 10% returns, who has more at age 60?",
            "options": ["Priya (invested 3x more)", "Both have equal amounts", "Aman (started earlier)", "Cannot determine without exact calculations"],
            "correct": 2,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "Aman wins! His ₹50,000 had 30 extra years to compound, growing to approximately ₹9,06,265. Priya''s ₹1,50,000 grew to about ₹8,22,470. Starting early is the ultimate financial hack."
        },
        {
            "q": "What is the SINGLE most important factor for building wealth through compounding?",
            "options": ["Having a high salary", "Investing large amounts", "Starting as early as possible", "Picking the best stocks"],
            "correct": 2,
            "xp": 15,
            "difficulty": "medium",
            "explanation": "Time is the most powerful factor in compounding. Starting early — even with small amounts — beats starting late with large amounts. Time is in the EXPONENT of the formula."
        },
        {
            "q": "Waiting 5 years to start investing ₹5,000/month at 12% returns could cost you approximately:",
            "options": ["₹5 lakhs", "₹25 lakhs", "₹1 crore or more", "It barely matters"],
            "correct": 2,
            "xp": 20,
            "difficulty": "hard",
            "explanation": "Over a 30+ year investment horizon, a 5-year delay at 12% returns can easily cost ₹1 crore or more due to the exponential nature of compounding. Every year counts!"
        }
    ]
}');


-- ============================================================
-- DONE! Summary:
-- • 1 Track: Compound Interest Mastery
-- • 9 Lessons across 3 sections (The Seed, Growth, Wealth Engine)
-- • 9 Flashcard blocks (27 flashcards total)
-- • 9 Quiz blocks (27 questions total)
-- • Mix of easy, medium, and hard questions
-- • Real-world scenarios: real estate, car loans, early investing
-- ============================================================
