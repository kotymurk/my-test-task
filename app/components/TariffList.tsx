'use client';
import { useState, useEffect } from 'react';
import Timer from './Timer';
import { Tariff } from '../types/Tariff';

export default function TariffList() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://t-core.fit-hub.pro/Test/GetTariffs')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then((data: Tariff[]) => {
        setTariffs(data);
        const best = data.find((t) => t.is_best);
        if (best) setSelectedId(best.id);
        else if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getDiscount = (price: number, fullPrice: number) =>
    Math.round((1 - price / fullPrice) * 100);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU').format(price);

  const handleBuy = () => {
    if (!isAgreed) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    const selected = tariffs.find((t) => t.id === selectedId);
    if (selected) {
      alert(
        `✅ Покупка: ${selected.period} за ${isExpired ? formatPrice(selected.full_price) : formatPrice(selected.price)} ₽`,
      );
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#232829] flex items-center justify-center text-gray-400'>
        Загрузка тарифов...
      </div>
    );
  }

  const bestTariff = tariffs.find((t) => t.is_best);
  const otherTariffs = tariffs.filter((t) => t.period !== 'Навсегда');
  const sortedOtherTariffs = [...otherTariffs].sort((a, b) => {
    if (a.period.includes('3')) return -1;
    if (b.period.includes('3')) return 1;
    return 0;
  });

  return (
    // overflow-x-hidden предотвращает горизонтальную прокрутку на мобильных
    <div className='min-h-screen bg-[#232829] text-white pb-12 overflow-x-hidden'>
      <Timer onExpire={() => setIsExpired(true)} />

      <main className='pt-20 px-3 md:px-6 max-w-7xl mx-auto flex flex-col items-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8'>
          Выбери подходящий для себя{' '}
          <span className='text-[#FDB056]'>тариф</span>
        </h1>

        {/* 🟦 ОСНОВНОЙ КОНТЕЙНЕР */}
        <div className='w-full bg-[#232829] border border-[#313637] rounded-3xl p-3 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6 items-start'>
          {/* 👤 АТЛЕТ */}
          {/* На мобильных/планшетах сверху, на десктопе слева */}
          <div className='w-full lg:w-1/3 flex justify-center lg:justify-start'>
            <img
              src='/maan.png'
              alt='Фитнес модель'
              className='h-40 md:h-56 lg:h-[500px] w-auto object-contain drop-shadow-2xl'
            />
          </div>

          {/* 💳 ТАРИФЫ + КНОПКА */}
          <div className='flex-1 w-full flex flex-col gap-4 md:gap-5'>
            {/* 🔝 БОЛЬШОЙ ТАРИФ ("Навсегда") */}
            {bestTariff && (
              <div
                onClick={() => setSelectedId(bestTariff.id)}
                className={`relative bg-[#313637] border-2 rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-200
                  ${selectedId === bestTariff.id ? 'border-[#FDB056]' : 'border-transparent hover:bg-[#3A4041]'}
                `}
              >
                {/* Убрали absolute, теперь flex-поток, чтобы не наезжало */}
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4'>
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <div className='bg-[#FD5656] text-xs font-bold px-2 py-1 rounded whitespace-nowrap'>
                      -{getDiscount(bestTariff.price, bestTariff.full_price)}%
                    </div>
                    <div>
                      <div className='text-2xl md:text-3xl font-black text-[#FDB056]'>
                        {isExpired
                          ? formatPrice(bestTariff.full_price)
                          : formatPrice(bestTariff.price)}{' '}
                        ₽
                      </div>
                      {!isExpired && (
                        <div className='text-gray-500 line-through text-sm'>
                          {formatPrice(bestTariff.full_price)} ₽
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex-1 text-center md:text-left'>
                    <h3 className='text-lg font-bold'>{bestTariff.period}</h3>
                    <p className='text-gray-400 text-sm leading-snug'>
                      {bestTariff.text}
                    </p>
                  </div>

                  <div className='text-[#FDB056] text-xs font-bold uppercase tracking-wide hidden md:block'>
                    ХИТ!
                  </div>
                </div>
              </div>
            )}

            {/* 🔽 МАЛЕНЬКИЕ ТАРИФЫ */}
            {/* 1 колонка на мобильных, 3 на планшете/десктопе */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              {sortedOtherTariffs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`relative bg-[#313637] rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-200 flex flex-col items-center text-center
                    ${selectedId === t.id ? 'border-2 border-[#FDB056] bg-[#3A4041]' : 'border-2 border-transparent hover:bg-[#3A4041]'}
                  `}
                >
                  <div className='absolute top-3 left-1/2 -translate-x-1/2 bg-[#FD5656] text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap'>
                    -{getDiscount(t.price, t.full_price)}%
                  </div>

                  <div className='mt-7 flex flex-col items-center justify-center w-full'>
                    <div className='text-xl md:text-2xl font-black text-white'>
                      {isExpired
                        ? formatPrice(t.full_price)
                        : formatPrice(t.price)}{' '}
                      ₽
                    </div>
                    {!isExpired && (
                      <div className='text-gray-500 line-through text-xs mb-1'>
                        {formatPrice(t.full_price)} ₽
                      </div>
                    )}

                    <h3 className='text-sm font-bold mt-1'>{t.period}</h3>
                    <p className='text-[11px] text-gray-400 mt-1 leading-snug'>
                      {t.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 💡 Подсказка */}
            <div className='bg-[#313637] rounded-xl p-3 flex items-start gap-2'>
              <span className='text-[#FDB056] text-lg leading-none'>!</span>
              <p className='text-xs text-gray-400 leading-snug'>
                Следуя плану на 3 месяца и более, люди получают в 2 раза лучший
                результат, чем за 1 месяц
              </p>
            </div>

            {/* ✅ Чекбокс */}
            <label
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all
                ${showError ? 'bg-[#FD5656]/10 ring-1 ring-[#FD5656] animate-shake' : 'hover:bg-[#313637]'}
              `}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0
                ${isAgreed ? 'bg-[#FDB056] border-[#FDB056]' : 'border-gray-600 bg-transparent'}
              `}
              >
                {isAgreed && (
                  <span className='text-[#232829] text-xs font-bold'>✓</span>
                )}
              </div>
              <input
                type='checkbox'
                className='hidden'
                checked={isAgreed}
                onChange={(e) => {
                  setIsAgreed(e.target.checked);
                  setShowError(false);
                }}
              />
              <span className='text-xs text-gray-400 leading-tight'>
                Я согласен с офертой рекуррентных платежей и Политикой
                конфиденциальности
              </span>
            </label>

            {/* 🔘 Кнопка */}
            <button
              onClick={handleBuy}
              disabled={!selectedId}
              className={`w-full py-3.5 font-bold rounded-full transition-all shadow-lg
                ${
                  selectedId
                    ? 'bg-[#FDB056] text-[#232829] hover:bg-[#fdcb85] active:scale-[0.98] cursor-pointer animate-blink-buy'
                    : 'bg-[#313637] text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Купить
            </button>

            <p className='text-[10px] text-gray-500 text-center leading-relaxed px-2'>
              Нажимая кнопку «Купить», Пользователь соглашается на разовое
              списание денежных средств для получения пожизненного доступа к
              приложению...
            </p>
          </div>
        </div>

        {/* 🛡️ Гарантия */}
        <div className='w-full max-w-4xl mt-6 md:mt-8 p-4 md:p-5 border border-[#3A4041] rounded-2xl bg-[#2D3233]'>
          <div className='inline-block px-3 py-1 border border-[#81FE95] text-[#81FE95] text-sm font-bold rounded-full mb-3'>
            гарантия возврата 30 дней
          </div>
          <p className='text-gray-400 text-sm leading-relaxed'>
            Мы уверены, что наш план сработает для тебя и ты увидишь видимые
            результаты уже через 4 недели! Мы даже готовы полностью вернуть твои
            деньги в течение 30 дней с момента покупки, если ты не получишь
            видимых результатов.
          </p>
        </div>
      </main>
    </div>
  );
}
