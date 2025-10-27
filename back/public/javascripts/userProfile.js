$(document).ready(function() {
    const statusButton = $(this).find('#status')
    const roleButton = $(this).find('#role')
    const statusSpan = $(this).find('#span_status')
    const roleSpan = $(this).find('#span_role')

    let span_content;
    let role_method;
    let status_method;

    if (user.role === 'admin') {
        roleSpan.text(user.role)

        roleButton.text('DEOP')
        role_method = 'deop'
    }
    else {
        roleSpan.text(user.role)
        roleButton.text('OP')
        role_method = 'op'
    }

    roleButton.on("click", () => {
        $.post(`/user/${user.id}`, {method: role_method})
            .done((data) => {

                if (role_method === 'op'){
                    roleSpan.text(data.userRole)
                    roleButton.text('DEOP')
                    role_method = 'deop'

                    if (span_content === 'blocked'){
                        statusButton.text('BAN')
                        span_content = data.userStatus
                        statusSpan.text(data.userStatus)
                        status_method = 'ban'
                    }

                }
                else {
                    roleSpan.text(data.userRole)
                    roleButton.text('OP')
                    role_method = 'op'
                }
            })
    })

    if (user.status === 'blocked') {
        span_content = user.status
        statusSpan.text(user.status)
        statusButton.text('UNBAN')
        status_method = 'unban'
    }
    else {
        span_content = user.status
        statusSpan.text(user.status)
        statusButton.text('BAN')
        status_method = 'ban'
    }

    statusButton.on("click", () => {
        $.post(`/user/${user.id}`, {method: status_method})
            .done((data) => {

                if (status_method === 'ban'){
                    span_content = data.userStatus
                    statusSpan.text(data.userStatus)
                    statusButton.text('UNBAN')
                    status_method = 'unban'

                    roleSpan.text(data.userRole)
                    roleButton.text('OP')
                    role_method = 'op'
                }
                else {
                    span_content = data.userStatus
                    statusSpan.text(data.userStatus)
                    statusButton.text('BAN')
                    status_method = 'ban'
                }
            })
    })


})