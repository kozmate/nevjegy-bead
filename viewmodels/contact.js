//Viewmodel réteg
var statusTexts = {
    'new': 'Új szám',
    'assigned': 'Feldogozás alatt',
    'ready': 'Kész',
    'rejected': 'A szám nem található',
    'pending': 'Téves szám?',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};

function decorateLessons(lessonContainer) {
    return lessonContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

module.exports = decorateLessons;