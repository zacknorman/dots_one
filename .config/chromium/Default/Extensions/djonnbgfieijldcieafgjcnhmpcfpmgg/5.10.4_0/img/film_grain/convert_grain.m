files = {
  '/home/amiller/WebstormProjects/polarr_photo_editor/public/img/film_grain/s-0_r-0.png',
  '/home/amiller/WebstormProjects/polarr_photo_editor/public/img/film_grain/s-0_r-100.png',
  '/home/amiller/WebstormProjects/polarr_photo_editor/public/img/film_grain/s-100_r-0.png',
  '/home/amiller/WebstormProjects/polarr_photo_editor/public/img/film_grain/s-100_r-100.png',
};

fileData = [];
for f = 1:numel(files)
  file = files{f};
  fileData(:,:,f) = imread(file)(:,:,1);
end

outputSize = [1024 1024];
outputOffset = [400 400];
blurDistance = [
[0 0]
[2 2]
[3 3]
[4 4]
];
yOffset = outputSize(2) * 0;

wrapData = zeros(outputSize(1), outputSize(2), 4);

for Layer = 1:4
  cutData = fileData(
    outputOffset(1) : outputOffset(1) + outputSize(1) + blurDistance(Layer, 1) - 1,
    outputOffset(2) : outputOffset(2) + outputSize(2) + blurDistance(Layer, 2) - 1,
    Layer
  );
  
  cutData(1:blurDistance(Layer, 1), :) = (
      cutData(1:blurDistance(Layer, 1), :) .* [1:blurDistance(Layer, 1)]' +
      cutData(outputSize(1):outputSize(1)+blurDistance(Layer, 1)-1, :) .* [blurDistance(Layer, 1):-1:1]'
  ) ./ (1 + blurDistance(Layer, 1));

  cutData(:, 1:blurDistance(Layer, 2), :) = (
      cutData(:, 1:blurDistance(Layer, 2), :) .* [1:blurDistance(Layer, 2)] +
      cutData(:, outputSize(2):outputSize(2)+blurDistance(Layer, 2)-1, :) .* [blurDistance(Layer, 2):-1:1]  
  ) ./ (1 + blurDistance(Layer, 2));

  wrapData(:,:,Layer) = cutData(1:outputSize(1), 1:outputSize(2), :);
end 

wrapData(:,:,:) /= 255;
path = "/home/amiller/WebstormProjects/polarr_photo_editor/public/img/film_grain/film_grain_small.png";
imwrite(wrapData(:, :, 1:3), path, "Alpha", wrapData(:, :, 4));

MeanValues = [
  mean(mean(wrapData(:,:,1))),
  mean(mean(wrapData(:,:,2))),
  mean(mean(wrapData(:,:,3))),
  mean(mean(wrapData(:,:,4)))
]

'done'
