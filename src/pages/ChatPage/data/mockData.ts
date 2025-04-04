import { ConversationType, DialogType } from '@models';

export const mockData: DialogType[] = [
  {
    id: '1',
    unreadCount: 0,
    time: '10:59',
    message: 'Привет! Как дела?',
    personName: 'Антон',
  },
  {
    id: '2',
    unreadCount: 3,
    time: '09:08',
    message: 'Ну чего ты там?',
    personName: 'Марина',
  },
  {
    id: '3',
    unreadCount: 279,
    time: '02:08',
    message: 'Исследование показало, что мужчины больше подвергаются чему-то чем женщины',
    personName: 'новый канал',
  },
  {
    id: '4',
    unreadCount: 8,
    time: 'Пт',
    message: 'Какое-то условное сообщение',
    personName: 'Олег',
  },
  {
    id: '5',
    unreadCount: 0,
    time: 'Чт',
    message: 'Ого, вот это круто реально!!!',
    personName: 'Даньчик',
  },
  {
    id: '6',
    unreadCount: 0,
    time: 'Чт',
    message:
      'Представляешь? сейчас очень забавную историю расскажу, иду я как-то по улице и тут как натыкаюсь на кое-что интересное',
    personName: 'Андрей',
  },
];

export const conversations: ConversationType[] = [
  {
    id: '1',
    messages: [
      { text: 'Привет, как дела?', time: '10:59', from: 'you' },
      {
        text: 'Нормально, а у тебя? Для современного мира постоянное информационно-пропагандистское обеспечение нашей деятельности играет определяющее значение для глубокомысленных рассуждений. Противоположная точка зрения подразумевает, что тщательные исследования конкурентов разоблачены. А ещё реплицированные с зарубежных источников, современные исследования рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. Равным образом, сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Кстати, элементы политического процесса разоблачены. Учитывая ключевые сценарии поведения, высококачественный прототип будущего проекта представляет собой интересный эксперимент проверки глубокомысленных рассуждений. Безусловно, реализация намеченных плановых заданий обеспечивает актуальность укрепления моральных ценностей. Есть над чем задуматься: многие известные личности неоднозначны и будут объективно рассмотрены соответствующими инстанциями.',
        time: '11:00',
        from: 'them',
      },
      {
        text: 'Нормально, а у тебя? Для современного мира постоянное информационно-пропагандистское обеспечение нашей деятельности играет определяющее значение для глубокомысленных рассуждений. Противоположная точка зрения подразумевает, что тщательные исследования конкурентов разоблачены. А ещё реплицированные с зарубежных источников, современные исследования рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. Равным образом, сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Кстати, элементы политического процесса разоблачены. Учитывая ключевые сценарии поведения, высококачественный прототип будущего проекта представляет собой интересный эксперимент проверки глубокомысленных рассуждений. Безусловно, реализация намеченных плановых заданий обеспечивает актуальность укрепления моральных ценностей. Есть над чем задуматься: многие известные личности неоднозначны и будут объективно рассмотрены соответствующими инстанциями.',
        time: '12:00',
        from: 'them',
      },
      {
        text: 'Нормально, а у тебя? Для современного мира постоянное информационно-пропагандистское обеспечение нашей деятельности играет определяющее значение для глубокомысленных рассуждений. Противоположная точка зрения подразумевает, что тщательные исследования конкурентов разоблачены. А ещё реплицированные с зарубежных источников, современные исследования рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. Равным образом, сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Кстати, элементы политического процесса разоблачены. Учитывая ключевые сценарии поведения, высококачественный прототип будущего проекта представляет собой интересный эксперимент проверки глубокомысленных рассуждений. Безусловно, реализация намеченных плановых заданий обеспечивает актуальность укрепления моральных ценностей. Есть над чем задуматься: многие известные личности неоднозначны и будут объективно рассмотрены соответствующими инстанциями.',
        time: '13:00',
        from: 'them',
      },
      {
        text: 'Нормально, а у тебя? Для современного мира постоянное информационно-пропагандистское обеспечение нашей деятельности играет определяющее значение для глубокомысленных рассуждений. Противоположная точка зрения подразумевает, что тщательные исследования конкурентов разоблачены. А ещё реплицированные с зарубежных источников, современные исследования рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. Равным образом, сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Кстати, элементы политического процесса разоблачены. Учитывая ключевые сценарии поведения, высококачественный прототип будущего проекта представляет собой интересный эксперимент проверки глубокомысленных рассуждений. Безусловно, реализация намеченных плановых заданий обеспечивает актуальность укрепления моральных ценностей. Есть над чем задуматься: многие известные личности неоднозначны и будут объективно рассмотрены соответствующими инстанциями.',
        time: '14:00',
        from: 'them',
      },
    ],
  },
  {
    id: '2',
    messages: [
      { text: 'Ну чего ты там?', time: '09:08', from: 'you' },
      { text: 'Сейчас приду', time: '09:09', from: 'them' },
    ],
  },
];
