document.addEventListener("DOMContentLoaded", function() {

var person = {}; // тут будут храниться имя сдающего тест и его ответы

var render = {
    test: 0,
    showTask: 0,
    totalTask: 0,
    testArea: document.getElementById("testArea"),

    main: function () {
        var ul = document.createElement('ul'),
            p = document.createElement('p');
        this.testArea.addEventListener('click', handler, false);
        p.innerHTML = "<strong id='question' question_id = '" + this.test[this.showTask].question_id +
                      "'>Вопрос:</strong> " + this.test[this.showTask].question;
        ul.className = "test";
        this.testArea.appendChild(p);
        this.testArea.appendChild(ul);
        this.answers(ul);
        this.navigate();
        return this.showTask += 1;
    },

    answers: function(ul) {
        var answer = this.test[this.showTask].variant.sort(function() {
            return Math.random() - 0.6;
        }),
        typeQuestion = (this.test[this.showTask].type == 'multiple') ? 'checkbox' : 'radio';

        for (var i=0; i<answer.length; i++) {
            var li = document.createElement('li');
            li.innerHTML = "<label><input type=" + typeQuestion +
                            " name='test' value='"+ answer[i].answer_id +"'>" + this.test[this.showTask].variant[i].answer +
                            "</label>";
            ul.appendChild(li);
        }
    },

    navigate: function() {
        var next = document.createElement('div');
        next.innerHTML = "<a href=\"#\">далее >></a>";
        this.testArea.appendChild(next);
    }
};

function checkForm() {
    var fio = document.getElementById("fio"),
        userName = fio.value,
        re = /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+(?: [А-ЯЁ][а-яё]+)?$/g;

    if (!re.test(userName)) {
        fio.style.borderColor = 'red';
        return false;
    }

    person.name = userName;
    loadTest();
  }

function loadTest() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'test.json', true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            // обработать ошибку
            alert('Ошибка ' + this.status + ': ' + this.statusText);
            return;
        } else {
            // выводим результат
            var test = JSON.parse(this.responseText);
            document.getElementById("testArea").innerHTML='';
            render.test = test.sort(function() {
                return Math.random() - 0.6;
            });
            render.totalTask = test.length; // всего вопросов
            render.main();
            timer();
        }
    }
}

function selectedAnswers() {
    var answer = [],
        question = document.getElementById('question'),
        question_id = 'question_' + question.getAttribute('question_id');
        div = document.getElementById('testArea'),
        items = div.getElementsByTagName('input'),
        check = 0; // счетчик выбранных input

    for(var i = 0; i < items.length; i++) {
        if (items[i].checked) {
            check++;
            answer.push(items[i].value);
        }
    }

    person[question_id] = answer;
  //  console.log(person);

    if(check == 0) {
        return false;
    }
}

function handler(e){
    var div = document.getElementById("testArea"),
        h1 = document.createElement('h1');

    if (e.target.nodeName == "A") {
        if (selectedAnswers() == false) {
            return false;
        }
        div.innerHTML='';

        if (render.totalTask > render.showTask) {
            render.main();
        } else {
            stopTime();
            result();
            h1.innerHTML = "Тест пройден";
            div.appendChild(h1);
        }
    }
    return false;
}

function timer() {
    var start = Date.now(),
        timer = 1e5; // 10 минут
        r = document.getElementById('r'),
        stop;
    (function f() {
        var diff = Date.now()-start,
            ts = parseInt((timer-diff)/1e3),
            m = parseInt(ts/60),
            s = ts-m*60;
        r.innerHTML = 'Время отводимое на тест ' + (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s;
        if(diff >= timer) {
            timeEnd();
        }
        stop = setTimeout(f,1e3);
    })();
}

function stopTime() {
    clearTimeout(stop);
}

function timeEnd() {
    stopTime();
    var div = document.getElementById('testArea');
    div.innerHTML = "<h2>Тест не сдан</h2><p>Подготовтесь получше и попробуйте в следующий раз.</p>";
}

function result() {
    console.log(person);
    var xhrr = new XMLHttpRequest();
    xhrr.open('POST', 'core.php', true);
    //xhrr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhrr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhrr.send(JSON.stringify(person));

    xhrr.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            // обработать ошибку
            alert('Ошибка ' + this.status + ': ' + this.statusText);
            return;
        } else {
            // выводим результат
            var test = this.responseText;
           document.getElementById("testArea").innerHTML= test;
        }
    }
}

startTest.addEventListener("click", loadTest);
stoping.addEventListener("click", stopTime);
newTest.addEventListener("click", checkForm);

});