INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'vegetarian'),
(2, 'vegan'),
(3, 'gluten free'),
(4, 'dairy free'),
(5, 'main course'),
(6, 'side dish'),
(7, 'dessert'),
(8, 'appetizer'),
(9, 'salad'),
(10, 'bread'),
(11, 'breakfast'),
(12, 'soup'),
(13, 'beverage'),
(14, 'sauce'),
(15, 'drink'),
(16, 'african'),
(17, 'chinese'),
(18, 'japanese'),
(19, 'korean'),
(20, 'thai'),
(21, 'indian'),
(22, 'vietnamese'),
(23, 'british'),
(24, 'irish'),
(25, 'french'),
(26, 'italian'),
(27, 'mexican'),
(28, 'spanish'),
(29, 'middle eastern'),
(30, 'jewish'),
(31, 'american'),
(32, 'cajun'),
(33, 'southern'),
(34, 'greek'),
(35, 'german'),
(36, 'nordic'),
(37, 'eastern european'),
(38, 'caribbean'),
(39, 'latin american');

ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;
