struct part
{
    float mass;
};

struct rel
{
    part &from, &to;
};
