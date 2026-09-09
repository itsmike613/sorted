const game = "SORTED";
const name = (en, es, ru) => ({ en, es, ru });

const palettes = {
    classic:["#E74C3C","#F39C12","#F1C40F","#2ECC71","#1ABC9C","#3498DB","#5B6EE1","#8E44AD","#E0569A","#8C5A3C"],
    neon:["#FF3131","#147DFF","#00FF9F","#FFF500","#8A2BE2","#FF6D00","#00F5FF","#FF1493","#F000FF","#39FF14"],
    forest:["#1F5D42","#4F7D4A","#7E9B57","#A3B77A","#7A5230","#A46F3F","#C89B63","#B85F3D","#4C8096","#86AEB7"],
    ocean:["#083B66","#0F6B8A","#1296A8","#22B8B0","#62D2C3","#A7E8D5","#F2D6A2","#F28C6B","#D94F70","#6B5FA7"],
    pastel:["#FFB3BA","#FFD6A5","#FFF1A8","#CDEFB2","#B8F2E6","#BDE0FE","#CDB4DB","#E2C2FF","#F7C6D9","#F4D7B5"],
    aurora:["#2D1B69","#3A4BA3","#4F7CAC","#5CB8A9","#7ED6A5","#C7E77A","#F6D365","#F5A65B","#E76F51","#B54C8C"],
    solarized:["#002B36","#586E75","#859900","#B58900","#CB4B16","#DC322F","#D33682","#6C71C4","#268BD2","#2AA198"],
    candy:["#FF6B9A","#FF9F68","#FFD166","#A8E063","#58D6C7","#5BC0EB","#7A8CFF","#A66CFF","#E56BFF","#FF85C2"],
    grayscale:["#111827","#273244","#3F4A5A","#596579","#748094","#9099A8","#AEB5BF","#C8CDD4","#E0E3E7","#F3F4F6"],
};

const choices = ["classic","neon","forest","ocean","pastel","aurora","solarized","candy","grayscale"];
const styles = ["liquid","ball"];

const words = {
    en: {
        tagline:"Pour it. Plan it. Sort it.", play:"Play", settings:"Settings", help:"Help", home:"Home", back:"Back", setup:"Setup", start:"Start Puzzle", replay:"Replay", newround:"New Puzzle",
        colors:"Colors", empty:"Empty Tubes", scramble:"Scramble", total:"Total Tubes", playing:"Puzzle in progress", time:"Time", moves:"Moves", undo:"Undo", redo:"Redo", restart:"Restart", new:"New",
        preferences:"Preferences", palette:"Palette", palettehelp:"Choose the color set used by the puzzle.", style:"Style", stylehelp:"Show each unit as stacked liquid or a separate ball.", classic:"Classic", neon:"Neon", forest:"Forest", ocean:"Ocean", pastel:"Pastel", aurora:"Aurora", solarized:"Solarized", candy:"Candy", grayscale:"Grayscale", liquid:"Liquid", ball:"Ball",
        complete:"Puzzle complete", results:"Results", completion:"Completion Time", configuration:"Configuration", guide:"Guide", how:"How to play", stats:"Time and Moves", theme:"Theme", language:"Language", tube:"Tube", scramblehelp:"Scramble is a relative mixing setting: higher values generally create more tangled starting arrangements.", board:"Puzzle board",
        helpintro:"{game} is a color sorting puzzle. Move matching groups between tubes until every non-empty tube is full with one color.",
        timerhelp:"Time begins when the generated board becomes playable and stops when the final solving move is completed.",
        moveshelp:"Moves counts valid pours in the current history path. Undo removes a move from that path and Redo restores it."
    },
    es: {
        tagline:"Viértelo. Planifícalo. Ordénalo.", play:"Jugar", settings:"Ajustes", help:"Ayuda", home:"Inicio", back:"Atrás", setup:"Configuración", start:"Iniciar puzzle", replay:"Repetir", newround:"Nuevo puzzle",
        colors:"Colores", empty:"Tubos vacíos", scramble:"Mezcla", total:"Tubos totales", playing:"Puzzle en curso", time:"Tiempo", moves:"Movimientos", undo:"Deshacer", redo:"Rehacer", restart:"Reiniciar", new:"Nuevo",
        preferences:"Preferencias", palette:"Paleta", palettehelp:"Elige el conjunto de colores que usa el puzzle.", style:"Estilo", stylehelp:"Muestra cada unidad como líquido apilado o como una bola separada.", classic:"Clásica", neon:"Neón", forest:"Bosque", ocean:"Océano", pastel:"Pastel", aurora:"Aurora", solarized:"Solarized", candy:"Caramelo", grayscale:"Escala de grises", liquid:"Líquido", ball:"Bola",
        complete:"Puzzle completado", results:"Resultados", completion:"Tiempo de finalización", configuration:"Configuración", guide:"Guía", how:"Cómo jugar", stats:"Tiempo y Movimientos", theme:"Tema", language:"Idioma", tube:"Tubo", scramblehelp:"Mezcla es un ajuste relativo: los valores más altos suelen crear disposiciones iniciales más enredadas.", board:"Tablero del puzzle",
        helpintro:"{game} es un puzzle de clasificación por colores. Mueve grupos coincidentes entre tubos hasta que cada tubo no vacío esté lleno con un solo color.",
        timerhelp:"El tiempo comienza cuando el tablero generado está listo para jugar y se detiene al completar el movimiento final.",
        moveshelp:"Movimientos cuenta los vertidos válidos en el historial actual. Deshacer elimina un movimiento de ese recorrido y Rehacer lo restaura."
    },
    ru: {
        tagline:"Перелей. Спланируй. Рассортируй.", play:"Играть", settings:"Настройки", help:"Помощь", home:"Главная", back:"Назад", setup:"Настройка", start:"Начать пазл", replay:"Повторить", newround:"Новый пазл",
        colors:"Цвета", empty:"Пустые пробирки", scramble:"Перемешивание", total:"Всего пробирок", playing:"Пазл в процессе", time:"Время", moves:"Ходы", undo:"Отменить", redo:"Вернуть", restart:"Перезапустить", new:"Новый",
        preferences:"Параметры", palette:"Палитра", palettehelp:"Выберите набор цветов для пазла.", style:"Стиль", stylehelp:"Показывать каждую единицу как слой жидкости или отдельный шарик.", classic:"Классика", neon:"Неон", forest:"Лес", ocean:"Океан", pastel:"Пастель", aurora:"Аврора", solarized:"Solarized", candy:"Конфеты", grayscale:"Оттенки серого", liquid:"Жидкость", ball:"Шарики",
        complete:"Пазл собран", results:"Результаты", completion:"Время завершения", configuration:"Конфигурация", guide:"Справка", how:"Как играть", stats:"Время и Ходы", theme:"Тема", language:"Язык", tube:"Пробирка", scramblehelp:"Перемешивание — относительная настройка: более высокие значения обычно создают более запутанную начальную расстановку.", board:"Поле пазла",
        helpintro:"{game} — головоломка на сортировку цветов. Переливайте совпадающие группы между пробирками, пока каждая непустая пробирка не будет полностью заполнена одним цветом.",
        timerhelp:"Время начинается, когда созданное поле становится доступно для игры, и останавливается после последнего решающего хода.",
        moveshelp:"Ходы учитывают допустимые переливания в текущей ветке истории. Отмена убирает ход из этой ветки, а возврат восстанавливает его."
    }
};

const steps = [
    name("Configure Colors, Empty Tubes, and Scramble in Setup.","Configura Colores, Tubos vacíos y Mezcla en Configuración.","Настройте количество цветов, пустых пробирок и перемешивание на экране настройки."),
    name("Change Palette and Style in Settings.","Cambia la Paleta y el Estilo en Ajustes.","Изменяйте Палитру и Стиль в Настройках."),
    name("Every tube holds exactly 4 units.","Cada tubo contiene exactamente 4 unidades.","Каждая пробирка вмещает ровно 4 единицы."),
    name("Tap a non-empty tube to select it. Tap it again to deselect it.","Toca un tubo no vacío para seleccionarlo. Tócalo de nuevo para deseleccionarlo.","Нажмите на непустую пробирку, чтобы выбрать её. Нажмите ещё раз, чтобы снять выбор."),
    name("Then tap an empty tube or a tube whose top color matches the selected tube.","Después toca un tubo vacío o uno cuyo color superior coincida con el tubo seleccionado.","Затем нажмите на пустую пробирку или на пробирку, верхний цвет которой совпадает с выбранной."),
    name("Matching top units pour automatically.","Las unidades superiores coincidentes se vierten automáticamente.","Совпадающие верхние единицы переливаются автоматически."),
    name("A pour stops when the connected group is exhausted or the destination reaches 4 units.","El vertido se detiene cuando se agota el grupo conectado o el tubo de destino llega a 4 unidades.","Переливание останавливается, когда группа заканчивается или пробирка назначения заполняется до 4 единиц."),
    name("Invalid destinations do not move anything or add a Move.","Los destinos no válidos no mueven nada ni añaden un Movimiento.","Недопустимое назначение ничего не перемещает и не добавляет Ход."),
    name("Time tracks the current run and Moves tracks the current valid-move history.","El Tiempo sigue la partida actual y Movimientos sigue el historial actual de movimientos válidos.","Время отслеживает текущую попытку, а Ходы — текущую историю допустимых переливаний."),
    name("Undo and Redo move backward and forward through that history.","Deshacer y Rehacer retroceden y avanzan por ese historial.","Отмена и Возврат перемещают назад и вперёд по этой истории."),
    name("Restart restores the same starting puzzle. New generates another puzzle with the same configuration.","Reiniciar restaura el mismo puzzle inicial. Nuevo genera otro puzzle con la misma configuración.","Перезапуск восстанавливает тот же исходный пазл. Новый создаёт другой пазл с той же конфигурацией."),
    name("Finish by making every non-empty tube contain 4 units of one color.","Termina haciendo que cada tubo no vacío contenga 4 unidades de un solo color.","Для завершения каждая непустая пробирка должна содержать 4 единицы одного цвета.")
];

const topics = [
    { title:name("Planning","Planificación","Планирование"), text:name("Thinking ahead and considering how a move may affect later options.","Pensar con anticipación y considerar cómo un movimiento puede afectar opciones posteriores.","Обдумывание будущих ходов и того, как текущий ход может повлиять на дальнейшие варианты.") },
    { title:name("Working Memory","Memoria de trabajo","Рабочая память"), text:name("Keeping the current arrangement and a short sequence of possible moves active while solving.","Mantener activa la disposición actual y una secuencia corta de posibles movimientos mientras resuelves.","Удержание текущей расстановки и короткой последовательности возможных ходов во время решения.") },
    { title:name("Sequencing","Secuenciación","Последовательность"), text:name("Organizing moves in a useful order so colors can be separated successfully.","Organizar los movimientos en un orden útil para separar los colores correctamente.","Организация ходов в полезном порядке, чтобы успешно разделить цвета.") },
    { title:name("Cognitive Flexibility","Flexibilidad cognitiva","Когнитивная гибкость"), text:name("Changing approach when a planned sequence becomes unhelpful or blocks useful moves.","Cambiar de enfoque cuando una secuencia planeada deja de ser útil o bloquea movimientos convenientes.","Смена подхода, когда запланированная последовательность становится бесполезной или блокирует нужные ходы.") },
    { title:name("Problem Solving","Resolución de problemas","Решение задач"), text:name("Using the puzzle's constraints and available moves to transform a mixed arrangement into the solved state.","Usar las restricciones del puzzle y los movimientos disponibles para transformar una disposición mezclada en una resuelta.","Использование ограничений головоломки и доступных ходов для преобразования смешанной расстановки в решённую.") }
];