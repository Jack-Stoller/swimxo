const getFormData = (formEvent, db) => {
    const els = formEvent.target.querySelectorAll('*[name]');
    let data = {};
    let refUpdates = [];

    for (let i = 0; i < els.length; i++) {
        const n = els[i].getAttribute('name');
        let t = els[i].getAttribute('data-type');
        if (t == null) t = els[i].getAttribute('type');

        switch (t) {
            case 'number':
                data[n] = parseFloat(els[i].value);
                break;

            case 'int':
                data[n] = parseInt(els[i].value);
                break;

            case 'date':
                data[n] = new Date(els[i].value);
                break;

            case 'reference':
                data[n] = db.doc(els[i].value);

                let r = els[i].getAttribute('data-ref-array');
                if (r) refUpdates.push({prop: r, doc: data[n], name: n})

                break;

            case 'json':
                data[n] = JSON.parse(els[i].value)
                break;

            case 'bool':
                data[n] = String(els[i].value).toLowerCase() === 'true'
                break;

            case 'ignored':
                break;

            default:
                data[n] = els[i].value;
                break;
        }
    }

    return [data, refUpdates];
}

export {getFormData}