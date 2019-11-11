Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function (chunkSize) {
        var array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

function processSlackResponse(data) {
    const { members } = data;

    const usersAvatar = members.map(item => {
        if (item.profile && item.profile.image_72) {
            return item.profile.image_72;
        }
    });

    return usersAvatar.chunk_inefficient(8).filter(item => item.length === 8);
}

module.exports = processSlackResponse;


