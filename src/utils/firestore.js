export const idConverter = {
    toFirestore: (data) => {
        delete data.id;
        return data;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data
        };
    },
};