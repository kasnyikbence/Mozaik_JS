let aktualisCim = null;
let aktualisElemLista = null;
const $lista = $('#lista');

$(document).ready(function () {
    $('#letrehoz').on('click', function () {
        const cim = $('#cim').val().trim();
        const tema = $('#tema').val().trim();
        const datum = $('#datum').val();

        if (!cim || !tema || !datum) {
            alert("Kérlek, tölts ki minden mezőt!");
            return;
        }

        const gyujtemenyId = 'gyujt-' + Date.now();
        const gyujtemenyek = `
          <div class="collection-item bg-white mb-3 p-3 border rounded" id="${gyujtemenyId}">
            <p>
              <strong>Cím:</strong> <span class="cim">${cim}</span><br>
              <strong>Témakör:</strong> <span class="tema">${tema}</span><br>
              <strong>Dátum:</strong> <span class="datum">${datum}</span>
            </p>
            <button class="btn btn-sm btn-outline-primary atnevez" data-bs-toggle="modal" data-bs-target="#renameModal">Átnevezés</button>
            <button class="btn btn-sm btn-outline-success addElem" data-bs-toggle="modal" data-bs-target="#elemModal">Új elem hozzáadása</button>
            <ul class="elemek mt-3 list-group"></ul>
          </div>
        `;


        $('#lista').append(gyujtemenyek);
        $('#cim, #tema, #datum').val('');
        const createModal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
        createModal.hide();
    });

    $lista.on('click', '.atnevez', function () {
        aktualisCim = $(this).closest('.collection-item').find('.cim');
        $('#atnevezesInput').val(aktualisCim.text());
    });

    $('#mentesAtnevezes').on('click', function () {
        const ujCim = $('#atnevezesInput').val().trim();
        if (ujCim && aktualisCim) {
            aktualisCim.text(ujCim);
            aktualisCim = null;
            const modal = bootstrap.Modal.getInstance(document.getElementById('renameModal'));
            modal.hide();
        }
    });

    $lista.on('click', '.addElem', function () {
        const gyujtemeny = $(this).closest('.collection-item');
        aktualisElemLista = gyujtemeny.find('.elemek');
        $('#atnevezesInput').val('');
    });

    $('#mentesElem').on('click', function () {
        const elemCim = $('#elemCim').val().trim();
        if (elemCim && aktualisElemLista) {
            const elemek = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="elem-cim">${elemCim}</span>
                <div class="dropdown">
                    <button class="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">...</button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item elem-atnevez" href="#renameModal">Átnevezés</a></li>
                        <li><a class="dropdown-item elem-athelyez" href="#">Áthelyezés</a></li>
                        <li><a class="dropdown-item elem-torles" href="#">Törlés</a></li>
                    </ul>
                </div>
            </li>
            `
            aktualisElemLista.append(elemek);
            const elemModal = bootstrap.Modal.getInstance(document.getElementById('elemModal'));
            elemModal.hide();
        }
    });

    $lista.on('click', '.elem-torles', function (e) {
        e.preventDefault();
        $(this).closest('.list-group-item').remove();
    });

    $lista.on('click', '.elem-atnevez', function (e) {
        e.preventDefault();
        aktualisCim = $(this).closest('.list-group-item').find('.elem-cim');
        $('#atnevezesInput').val(aktualisCim.text());
        const modal = new bootstrap.Modal(document.getElementById('renameModal'));
        modal.show();
    });

    $lista.on('click', '.elem-athelyez', function (e) {
        e.preventDefault();

        currentItem = $(this).closest('.list-group-item');
        const currentCollection = currentItem.closest('.collection-item');
        const allCollections = $('.collection-item');

        const dropdown = $('#celGyujtemeny');
        dropdown.empty();

        allCollections.each(function () {
            if (this !== currentCollection[0]) {
                const existingTitles = $(this).find('.elem-cim').map(function () {
                    return $(this).text();
                }).get();

                const currentTitle = currentItem.find('.elem-cim').text();

                if (!existingTitles.includes(currentTitle)) {
                    const title = $(this).find('.cim').text();
                    const value = $(this).attr('id');
                    dropdown.append(`<option value="${value}">${title}</option>`);
                }
            }
        });
        const modal = new bootstrap.Modal(document.getElementById('transferModal'));
        modal.show();
    });

    $('#modalAthelyezesGomb').on('click', function () {
        const selectedId = $('#celGyujtemeny').val();
        if (!selectedId) return;

        const celGyujtemeny = $('#' + selectedId).find('.elemek');
        celGyujtemeny.append(currentItem);

        const modal = bootstrap.Modal.getInstance(document.getElementById('transferModal'));
        modal.hide();
    });
});