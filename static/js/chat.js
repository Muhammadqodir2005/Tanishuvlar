const text_box = '<div class="d-flex justify-content-end">'+
    '<div class="card-panel right" style="width: 75%; position: relative">' +
    '<div style="position: absolute; top: 0; left:3px; font-weight: bolder" class="title">{sender}</div>' +
    '{message}' +
    '</div>'+
    '</div>';

let userState = ''

const userDiv = (senderId, receiverId, name, online, image) =>
    (`<a href="/chat/${senderId}/${receiverId}" id="user${receiverId}" class="collection-item">
                    <div class="d-flex justify-content-between py-1">
                        <div >
                        <img src="/static/user_icon.png" alt="userimage" style="width:70px; height:70px; borderRadius : 5px">
                        <span class="title mx-2" style="font-weight: bolder">${name}</span>
                        </div>
                        <span style="color: ${online ? 'green' : 'red'};">${online ? 'online' : 'offline'}</span>
                    </div>
                </a>`)

function scrolltoend() {
    $('#board').stop().animate({
        scrollTop: $('#board')[0].scrollHeight
    }, 800);
}

function send(sender, receiver, message) {
    $.post('/api/messages', '{"sender": "' + sender + '", "receiver": "' + receiver + '","message": "' + message + '" }', function (data) {
        console.log(data);
        var box = text_box.replace('{sender}', "You");
        box = box.replace('{message}', message);
        $('#board').append(box);
        scrolltoend();
    })
}

function receive() {
    $.get('/api/messages/' + sender_id + '/' + receiver_id, function (data) {
        console.log(data);
        if (data.length !== 0) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                var box = text_box.replace('{sender}', data[i].sender);
                box = box.replace('{message}', data[i].message);
                box = box.replace('right', 'left blue lighten-5');
                box = box.replace('justify-content-end', 'justify-content-start');
                $('#board').append(box);
                scrolltoend();
            }
        }
    })
}

function getUsers(senderId, callback) {
    return $.get('/api/users', function (data) {
        if (userState !== JSON.stringify(data)) {
            userState = JSON.stringify(data);
            const doc = data.reduce((res, user) => {
                if (user.id === senderId) {
                    return res
                } else {
                    return [userDiv(senderId, user.id, user.username, user.online), ...res]
                }
            }, [])
            callback(doc)
        }
    })
}

function register(username, password) {
    $.post('/api/users', '{"username": "' + username + '", "password": "' + password + '"}',
        function (data) {
            console.log(data);
            window.location = '/';
        }).fail(function (response) {
            $('#id_username').addClass('invalid');
        })
}
