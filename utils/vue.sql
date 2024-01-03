
SELECT
    nummvt,
    codedepot AS codedepot,
    dep.libdepot AS nomdepot,
    typemvt AS typemvt,
    DATE_FORMAT(datemvt,'%d/%m/%Y') AS datemvt,
    DATE_FORMAT(datemvt,'%-%m-%d') AS dateng,
    objemvt AS objemvt,
    detmvt AS detmvt
FROM table_stock
    JOIN table_depot dep ON st.codedepot = dep.codedepot
WHERE   typemvt = 'S'